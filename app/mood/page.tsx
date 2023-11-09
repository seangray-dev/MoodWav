'use client';

import MoodWavLogo from '@/assets/images/moodwav-high-resolution-logo-transparent.png';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { determineUserMood } from '@/utils/mood_calculations/calculations';
import {
  TrackDetail,
  fetchAudioFeaturesForTracks,
  fetchRecentlyPlayedTracks,
  fetchSpotifyUserID,
} from '@/utils/spotify/spotify';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ErrorAlert from './Error';
import LoadingData from './LoadingData';
import MoodScoreCard from './MoodScoreCard';
import NoMoodData from './NoMoodData';
import RecentlyPlayed from './RecentlyPlayed';

const Mood = () => {
  // Local State
  const router = useRouter();
  const [spotifyUserID, setSpotifyUserID] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [moodData, setMoodData] = useState<{
    highestMood: string;
    highestScore: number;
    allMoods: Record<string, number>;
  } | null>(null);
  const [recentTracks, setRecentTracks] = useState<TrackDetail[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Functions

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const accessToken = sessionStorage.getItem('spotifyAccessToken');
        if (!accessToken) throw new Error('Access token not found.');

        const tracksDetails = await fetchRecentlyPlayedTracks(accessToken);

        if (!tracksDetails || tracksDetails.length === 0)
          throw new Error('No recently played tracks found.');

        setRecentTracks(tracksDetails);

        const trackIds = tracksDetails.map((track) => track.id);
        const audioFeatures = await fetchAudioFeaturesForTracks(
          trackIds,
          accessToken
        );
        if (!audioFeatures || audioFeatures.length === 0)
          throw new Error('Could not fetch audio features for tracks.');

        const mood = determineUserMood(audioFeatures);
        setMoodData(mood);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clearing the session storage or any other client-side storage where the token is saved
      sessionStorage.clear();

      // Redirect to login or home page after successful sign out
      router.push('/');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  if (loading) {
    return <LoadingData />;
  }

  if (error) {
    return <ErrorAlert />;
  }

  if (!moodData) {
    return <NoMoodData />;
  }

  return (
    <div className='flex flex-1 flex-col place-content-center moodring w-full'>
      <div className='flex justify-end container'>
        <Button
          onClick={async () => {
            await signOut();
          }}
          variant={'ghost'}
          className='flex-end hover:bg-transparent hover:text-white hover:underline transition-all duration-300 pt-6'>
          Sign out
        </Button>
      </div>
      <div className='md:container px-2 mt-20'>
        <Image
          className='mb-10 mx-auto'
          src={MoodWavLogo}
          alt='moodwav logo'
          width={300}
          height={200}
        />
        <MoodScoreCard moodData={moodData} setSelectedMood={setSelectedMood} />
        <RecentlyPlayed
          recentTracks={recentTracks}
          selectedMood={selectedMood}
          setSelectedMood={(mood: string | null) =>
            setSelectedMood(mood ?? null)
          }
        />
      </div>
      <Footer />
    </div>
  );
};

export default Mood;
