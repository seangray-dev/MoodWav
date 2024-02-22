'use client';

import TopArtists from '@/components/my-best-of/TopArtists';
import TopTracks from '@/components/my-best-of/TopTracks';
import {
  fetchUsersTopArtists,
  fetchUsersTopTracks,
} from '@/utils/spotify/spotify';
import { supabase } from '@/utils/supabase/client';
import React, { useEffect, useState } from 'react';

export default function BestOfPage() {
  const [topArtists, setTopArtists] = useState<any>(null);
  const [timeFrameArtists, setTimeFrameArtists] =
    useState<string>('medium_term');
  const [topTracks, setTopTracks] = useState<any>(null);
  const [timeFrameTracks, setTimeFrameTracks] = useState<string>('medium_term');
  const [accessToken, setAccessToken] = useState<string | null>(null); // State variable for accessToken

  useEffect(() => {
    const getAccessToken = async () => {
      const { data: session } = await supabase.auth.getSession();
      setAccessToken(session?.session?.provider_token || null);
    };

    getAccessToken();
  }, []);

  useEffect(() => {
    const getTopArtists = async () => {
      if (accessToken) {
        try {
          const topArtistsData = await fetchUsersTopArtists(
            accessToken,
            timeFrameArtists
          );
          setTopArtists(topArtistsData.items);
        } catch (error) {
          console.error('Error fetching top artists:', error);
        }
      }
    };

    getTopArtists();
  }, [accessToken, timeFrameArtists]);

  useEffect(() => {
    const getTopTracks = async () => {
      if (accessToken) {
        try {
          const topTracksData = await fetchUsersTopTracks(
            accessToken,
            timeFrameTracks
          );
          setTopTracks(topTracksData.items);
        } catch (error) {
          console.error('Error fetching top tracks:', error);
        }
      }
    };

    getTopTracks();
  }, [accessToken, timeFrameTracks]);

  return (
    <div className='w-full py-10'>
      <h1 className='text-2xl 2xl:text-6xl md:text-4xl font-bold mb-10'>
        My Best Of Spotify
      </h1>
      <div className='flex flex-col gap-20'>
        {accessToken && (
          <TopArtists
            accessToken={accessToken}
            topArtists={topArtists}
            setTimeFrame={setTimeFrameArtists}
          />
        )}
        <TopTracks topTracks={topTracks} setTimeFrame={setTimeFrameTracks} />
      </div>
    </div>
  );
}
