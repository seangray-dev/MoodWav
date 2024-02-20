'use client';

import MoodWavLogo from '@/assets/images/moodwav-high-resolution-logo-transparent.png';
import { determineUserMood } from '@/utils/mood_calculations/calculations';
import {
  TrackDetail,
  fetchAudioFeaturesForTracks,
  fetchRecentlyPlayedTracks,
} from '@/utils/spotify/spotify';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ErrorAlert from './Error';
import LoadingData from './LoadingData';
import MoodScoreCard from './MoodScoreCard';
import NoMoodData from './NoMoodData';
import RecentlyPlayed from './RecentlyPlayed';

const Mood = () => {
  // Local State
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

        // Use supabase.auth.getSession() to retrieve the current session
        const { data: session, error } = await supabase.auth.getSession();

        if (error || !session.session?.provider_token) {
          throw new Error('Error retrieving user session');
        }

        if (session) {
          const accessToken = session.session?.provider_token;
          const tracksDetails = await fetchRecentlyPlayedTracks(accessToken);

          if (!tracksDetails || tracksDetails.length === 0) {
            throw new Error('No recently played tracks found.');
          }

          setRecentTracks(tracksDetails);

          const trackIds = tracksDetails.map((track) => track.id);
          const audioFeatures = await fetchAudioFeaturesForTracks(
            trackIds,
            accessToken
          );

          if (!audioFeatures || audioFeatures.length === 0) {
            throw new Error('Could not fetch audio features for tracks.');
          }

          const mood = determineUserMood(audioFeatures);
          setMoodData(mood);
        } else {
          throw new Error('User not authenticated.');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

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
    <div className='flex flex-1 flex-col place-content-center w-full'>
      <Link className='mt-4 underline w-fit' href={'/mood/how-it-works'}>
        How it works
      </Link>
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
    </div>
  );
};

export default Mood;
