'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { Song } from '@/utils/spotify/constants';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Button } from '../ui/button';
import { data as mockData } from './data.js';

export default function SongCards() {
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [songPair, setSongPair] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const audioPlayersRef = useRef<{ [key: string]: AudioPlayer | null }>({});
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [voteCast, setVoteCast] = useState<boolean>(false);

  useEffect(() => {
    // Filter mock data to include only tracks with a preview URL
    const filteredData = mockData.tracks.filter((track) => track.preview_url);
    setRecommendations(filteredData.slice(2)); // Set the remaining tracks for future use
    setSongPair(filteredData.slice(0, 2)); // Initialize with the first two tracks
  }, []);

  const serveNextPair = () => {
    setLoading(true);
    if (recommendations.length >= 2) {
      setSongPair(recommendations.slice(0, 2));
      setRecommendations(recommendations.slice(2));
      setLoading(false);
    } else {
      console.log('No more songs to display.');
      // Here, you might want to refetch or reset the recommendations for a real application
    }
  };

  const handlePlay = (songId: string) => {
    if (currentPlaying && currentPlaying !== songId) {
      audioPlayersRef.current[currentPlaying]?.audio.current.pause();
    }
    setCurrentPlaying(songId);
  };

  const handleVote = async (song: Song): Promise<void> => {
    console.log(`Voted for song with ID: ${song.id}`);

    try {
      // Start a transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('tracks')
        .select('vote_count')
        .eq('spotify_track_id', song.id)
        .single();

      if (transactionError && transactionError.code !== 'PGRST116') {
        throw transactionError;
      }

      if (transaction) {
        // If the track exists, increment the vote_count and update modified_at
        const { error: incrementError } = await supabase
          .from('tracks')
          .update({
            vote_count: transaction.vote_count + 1,
            modified_at: 'now()', // Set the modified_at to the current timestamp
          })
          .eq('spotify_track_id', song.id);

        if (incrementError) {
          throw incrementError;
        }
      } else {
        // If the track doesn't exist, insert it with modified_at
        const { error: insertError } = await supabase.from('tracks').insert([
          {
            spotify_track_id: song.id,
            song: song.name,
            artist: song.artists.map((artist) => artist.name).join(', '),
            vote_count: 1,
            modified_at: 'now()', // Set the modified_at to the current timestamp
          },
        ]);

        if (insertError) {
          throw insertError;
        }
      }

      console.log('Vote counted.');
      setVoteCast(true);
      // Delay serving the next pair of songs to allow for animation and update of vote counts
      setTimeout(() => {
        serveNextPair();
        setVoteCast(false);
      }, 2000); // Adjust delay as needed for animation and feedback
    } catch (error) {
      console.error('Error upserting or updating vote count:', error);
    }
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

  if (loading) {
    return <div>Loading songs...</div>;
  }

  if (!songPair || songPair.length === 0) {
    return <div>No more songs to display.</div>;
  }

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
            {voteCast && (
              <div className='text-center font-bold'>
                Votes: {voteCounts[song.id]}
              </div>
            )}
              <div className='text-center font-bold'>
                Votes: {voteCounts[song.id]}
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
