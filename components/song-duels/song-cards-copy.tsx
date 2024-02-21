'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { Song } from '@/utils/spotify/constants';
import { fetchRecommendations } from '@/utils/spotify/spotify';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Button } from '../ui/button';

export default function SongCards() {
  const [recommendations, setRecommendations] = useState([]);
  const [songPair, setSongPair] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const audioPlayersRef = useRef<{ [key: string]: AudioPlayer | null }>({});
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [voteCast, setVoteCast] = useState<boolean>(false);

  const fetchAndSetRecommendations = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const accessToken = session?.session?.provider_token;

      if (accessToken) {
        setLoading(true);
        const fetchedRecommendations = await fetchRecommendations(accessToken);
        console.log('Fetched Recommendations:', fetchedRecommendations);
        setRecommendations(fetchedRecommendations);
        setLoading(false);
      } else {
        console.log('No access token available.');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetRecommendations();
  }, []);

  useEffect(() => {
    const subscribeToChanges = async () => {
      const subscription = supabase
        .channel('realtime:public:tracks')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tracks' },
          (payload) => {
            console.log('Change received!', payload);
            if (payload.new && payload.new.spotify_track_id) {
              setVoteCounts((prev) => ({
                ...prev,
                [payload.new.spotify_track_id]: payload.new.vote_count,
              }));
            }
          }
        )
        .subscribe();

      if (subscription.error) {
        console.error('Subscription error:', subscription.error);
      }

      return () => {
        supabase.removeChannel(subscription);
      };
    };

    subscribeToChanges();
  }, []);

  useEffect(() => {
    // Ensure that recommendations.tracks is defined before filtering
    if (recommendations.tracks) {
      const filteredData = recommendations.tracks.filter(
        (track) => track.preview_url
      );
      setRecommendations(filteredData.slice(2)); // Set remaining tracks for future use
      setSongPair(filteredData.slice(0, 2)); // Initialize with the first two tracks
      insertSongsIfNeeded(filteredData.slice(0, 2)); // Insert initial songs into the database if needed
    }
  }, [recommendations]);

  const insertSongsIfNeeded = async (songs) => {
    for (const song of songs) {
      const { data, error } = await supabase
        .from('tracks')
        .select('id')
        .eq('spotify_track_id', song.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking song existence:', error);
        continue;
      }

      if (!data) {
        const { error: insertError } = await supabase.from('tracks').insert([
          {
            spotify_track_id: song.id,
            vote_count: 0,
            song: song.name,
            artist: song.artists.map((artist) => artist.name).join(', '),
            modified_at: new Date(),
          },
        ]);

        if (insertError) {
          console.error('Error inserting song:', insertError);
        } else {
          console.log(`Song inserted: ${song.name}`);
        }
      }
    }
  };

  const serveNextPair = async () => {
    if (recommendations.length >= 2) {
      const nextPair = recommendations.slice(0, 2);
      setSongPair(nextPair);
      setRecommendations(recommendations.slice(2));
      await insertSongsIfNeeded(nextPair);
      setLoading(false);
      setVoteCast(false);
    } else {
      console.log('Fetching more recommendations...');
      await fetchAndSetRecommendations();
    }
  };

  const handleVote = async (song: Song) => {
    console.log(`Voting for song with ID: ${song.id}`);
    setVoteCast(true);

    const { data, error } = await supabase.rpc('increment_vote', {
      song_id: song.id,
    });

    if (error) {
      console.error('Error voting for song:', error);
    } else {
      console.log('Vote response:', data);
      const newVoteCount = await fetchVoteCount(song.id);
      setVoteCounts((prev) => ({
        ...prev,
        [song.id]: newVoteCount,
      }));
    }

    setTimeout(() => {
      setVoteCast(false);
      serveNextPair();
    }, 2000);
  };

  const fetchVoteCount = async (songId: string): Promise<number> => {
    const { data, error } = await supabase
      .from('tracks')
      .select('vote_count')
      .eq('spotify_track_id', songId)
      .single();

    if (error) {
      console.error('Error fetching vote count:', error);
      return 0; // Return 0 as default vote count in case of an error
    }

    return data?.vote_count || 0; // Return the vote count or 0 if not found
  };

  const updateVoteCounts = async () => {
    const counts: Record<string, number> = {};
    for (const song of songPair) {
      const count = await fetchVoteCount(song.id);
      counts[song.id] = count;
    }
    setVoteCounts(counts);
  };

  useEffect(() => {
    updateVoteCounts();
  }, [songPair]);

  const handlePlay = (songId) => {
    // If there's a song currently playing and it's not the one that was just played, pause it
    if (currentPlaying && currentPlaying !== songId) {
      audioPlayersRef.current[currentPlaying].audio.current.pause();
    }
    setCurrentPlaying(songId);
  };

  if (loading) {
    return <div>Loading songs...</div>;
  }

  // if (!songPair || songPair.length === 0) {
  //   return <div>No more songs to display.</div>;
  // }

  return (
    <div className='grid md:grid-cols-2 gap-10 max-w-3xl mx-auto'>
      {songPair.map((song) => (
        <Card
          key={song.id}
          className='text-sm md:text-base pb-4 border-none flex flex-col max-w-xs mx-auto items-center rounded-t-none'>
          <CardHeader className='p-0 w-full h-full'>
            <Image
              width={600}
              height={600}
              className='w-full h-full object-cover'
              src={song.album.images[0]?.url || ''}
              alt={`Cover art for ${song.name}`}
            />
          </CardHeader>
          <div className='p-4 flex flex-col gap-3'>
            <div>
              <h2 className='font-bold'>{song.name}</h2>
              <p className='text-muted-foreground'>
                {song.artists
                  .map((artist: { name: string }) => artist.name)
                  .join(', ')}
              </p>
            </div>
            {song.preview_url && (
              <div className='w-[250px] mx-auto'>
                <AudioPlayer
                  className='audio-player !border-none'
                  src={song.preview_url}
                  showJumpControls={false}
                  showDownloadProgress={false}
                  customAdditionalControls={[]}
                  onPlay={() => handlePlay(song.id)}
                  ref={(element) => {
                    audioPlayersRef.current[song.id] = element;
                  }}
                />
              </div>
            )}
            <div className='h-4'>
              {voteCast && (
                <div className='text-center font-bold'>
                  Votes: {voteCounts[song.id]}
                </div>
              )}
            </div>
            <Button
              className='justify-center w-full text-white'
              onClick={() => handleVote(song)}>
              Vote
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
