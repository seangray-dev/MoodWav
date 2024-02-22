'use client';

import { Card, CardHeader } from '@/components/ui/card';
import useRealtimeVotes from '@/hooks/useRealTimeVotes';
import useRecommendations from '@/hooks/useRecommendations';
import { Song } from '@/utils/spotify/constants';
import { supabase } from '@/utils/supabase/client';
import { insertSongsToDb } from '@/utils/supabase/db';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Loader from '../layout/Loader';
import { Button } from '../ui/button';

export default function SongCards() {
  const [songPair, setSongPair] = useState<Song[]>([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const audioPlayersRef = useRef<{ [key: string]: AudioPlayer | null }>({});
  const [voteCast, setVoteCast] = useState<boolean>(false);
  const voteCounts = useRealtimeVotes();
  const { recommendations, loading, fetchMore } = useRecommendations();

  console.log(recommendations);

  useEffect(() => {
    const newPair = recommendations.slice(
      currentPairIndex,
      currentPairIndex + 2
    );
    setSongPair(newPair);
    insertSongsToDb(newPair);
  }, [recommendations, currentPairIndex]);

  useEffect(() => {
    // Check if we're nearing the end of the recommendations list
    if (currentPairIndex >= recommendations.length - 4) {
      fetchMore();
    }
  }, [currentPairIndex, recommendations]);

  const serveNextPair = () => {
    const newIndex = currentPairIndex + 2;

    if (newIndex < recommendations.length) {
      setCurrentPairIndex(newIndex);
    } else {
      // Handle the case when you're at the end of the recommendations list
      // This might involve fetching more recommendations or looping back to the start
      console.log("You've reached the end of the recommendations.");
      setCurrentPairIndex(0);
    }
  };

  const handleVote = async (songId: string) => {
    setVoteCast(true);
    // Implement the vote logic here, utilizing the backend or a context/provider if necessary

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
    setCurrentPlaying(null);
    return data?.vote_count || 0; // Return the vote count or 0 if not found
  };

  const handlePlay = (songId) => {
    // If there's a song currently playing and it's not the one that was just played, pause it
    if (currentPlaying && currentPlaying !== songId) {
      audioPlayersRef.current[currentPlaying].audio.current.pause();
    }
    setCurrentPlaying(songId);
  };

  if (loading) {
    return <Loader message={'Loading songs...'} />;
  }

  return (
    <div className='grid md:grid-cols-2 gap-10 max-w-3xl mx-auto'>
      {songPair.map((song) => (
        <Card
          key={song.id}
          className='text-sm md:text-base p-0 pb-4 border-none flex flex-col max-w-[300px] mx-auto items-center rounded-t-none'>
          <CardHeader className='p-0 w-full h-full'>
            <Image
              width={300}
              height={300}
              className='w-full h-full object-cover'
              src={song.album.images[0]?.url || ''}
              alt={`Cover art for ${song.name}`}
            />
          </CardHeader>
          <div className='p-2 flex flex-col gap-3'>
            <div>
              <h2 className='font-bold text-sm'>{song.name}</h2>
              <p className='text-muted-foreground text-sm'>
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
              onClick={() => handleVote(song.id)}>
              Vote
            </Button>
          </div>
        </Card>
      ))}
      <div>
        {currentPairIndex} / {recommendations.length}
      </div>
    </div>
  );
}
