'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { fetchRandomRecommendationPair } from '@/utils/spotify/spotify';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Button } from '../ui/button';

export default function SongCards() {
  const [songPair, setSongPair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const audioPlayersRef = useRef({});

  useEffect(() => {
    const fetchSongs = async () => {
      const { data: session } = await supabase.auth.getSession();
      const accessToken = session?.session?.provider_token;
      console.log(accessToken);
      if (accessToken) {
        setLoading(true);
        const songs = await fetchRandomRecommendationPair(accessToken);
        setSongPair(songs);
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handlePlay = (songId) => {
    // If there's a song currently playing and it's not the one that was just played, pause it
    if (currentPlaying && currentPlaying !== songId) {
      audioPlayersRef.current[currentPlaying].audio.current.pause();
    }
    setCurrentPlaying(songId);
  };

  const handleVote = async (songId) => {
    console.log(`Voted for song with ID: ${songId}`);

    setLoading(true);

    const { data: session } = await supabase.auth.getSession();
    const accessToken = session?.session?.provider_token;
    if (accessToken) {
      try {
        const newSongs = await fetchRandomRecommendationPair(accessToken);

        // Reset currentPlaying and clear audioPlayersRef before setting new songs
        setCurrentPlaying(null);
        audioPlayersRef.current = {}; // Reset the refs object

        setSongPair(newSongs);
      } catch (error) {
        console.error('Error fetching new pair of songs:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div>Loading songs...</div>;
  }

  if (!songPair || songPair.length === 0) {
    return <div>No songs to display. Please try again later.</div>;
  }

  return (
    <div className='grid md:grid-cols-2 gap-10  max-w-3xl mx-auto'>
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
                {song.artists.map((artist: any) => artist.name).join(', ')}
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
            <div className='text-center font-bold'>Votes:</div>
            <Button
              className='justify-center w-full text-white'
              onClick={() => handleVote(song.id)}>
              Vote
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
