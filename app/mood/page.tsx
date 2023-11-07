'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { determineUserMood } from '@/utils/mood_calculations/calculations';
import {
  fetchAudioFeaturesForTracks,
  fetchSpotifyUserID,
  getRecentlyPlayedTrackIds,
} from '@/utils/spotify/spotify';
import { ShareIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import ErrorAlert from './Error';
import LoadingData from './LoadingData';
import NoMoodData from './NoMoodData';

const Mood = () => {
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

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const accessToken = sessionStorage.getItem('spotifyAccessToken');
        if (!accessToken) throw new Error('Access token not found.');

        const recentlyPlayedTrackIDs = await getRecentlyPlayedTrackIds(
          accessToken
        );
        if (!recentlyPlayedTrackIDs || !recentlyPlayedTrackIDs.length)
          throw new Error('No recently played tracks found.');

        const audioFeatures = await fetchAudioFeaturesForTracks(
          recentlyPlayedTrackIDs,
          accessToken
        );
        if (!audioFeatures.length)
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

  const moodBG = {
    joyful: 'bg-yellow-200',
    relaxed: 'bg-green-300',
    sad: 'bg-blue-300',
    angry: 'bg-red-300',
    energetic: 'bg-orange-300',
    reflective: 'bg-indigo-300',
  };

  const moodTextColor = {
    joyful: 'text-yellow-900',
    relaxed: 'text-green-900',
    sad: 'text-blue-900',
    angry: 'text-red-900',
    energetic: 'text-orange-900',
    reflective: 'text-indigo-900',
  };

  const moodGradient = {
    joyful: 'bg-gradient-to-b from-yellow-400 to-yellow-300',
    relaxed: 'bg-gradient-to-b from-green-400 to-green-300',
    sad: 'bg-gradient-to-b from-blue-400 to-blue-300',
    angry: 'bg-gradient-to-b from-red-500 to-red-300',
    energetic: 'bg-gradient-to-b from-orange-400 to-orange-300',
    reflective: 'bg-gradient-to-b from-indigo-400 to-indigo-300',
  };

  const moodGradientReverse = {
    joyful: 'bg-gradient-to-t from-yellow-400 to-yellow-300',
    relaxed: 'bg-gradient-to-t from-green-400 to-green-300',
    sad: 'bg-gradient-to-t from-blue-400 to-blue-300',
    angry: 'bg-gradient-to-t from-red-500 to-red-300',
    energetic: 'bg-gradient-to-t from-orange-400 to-orange-300',
    reflective: 'bg-gradient-to-t from-indigo-400 to-indigo-300',
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
      <div className='container'>
        <Card className='border-none mx-auto flex flex-col gap-6 md:grid md:grid-cols-2 md:max-w-[736px] rounded-[32px]'>
          <Card
            className={`md:flex md:flex-col md:place-content-center md:gap-0 md:justify-evenly border-none rounded-[32px] flex flex-col gap-4 pb-10 py-6 ${
              moodGradient[
                moodData.highestMood.toLowerCase() as keyof typeof moodGradient
              ]
            } `}>
            <p className='text-center font-medium text-lg text-muted md:text-2xl'>
              Your Mood
            </p>
            <div className='flex justify-center'>
              <div
                className={`flex flex-col justify-center items-center rounded-full w-[140px] h-[140px] md:w-[200px] md:h-[200px] ${
                  moodGradientReverse[
                    moodData.highestMood.toLowerCase() as keyof typeof moodGradient
                  ]
                } `}>
                <span className='text-[56px] md:text-[72px] text-white font-bold'>
                  {moodData.highestScore.toFixed(1)}
                </span>
              </div>
            </div>
            <p className='text-center text-white text-2xl font-bold md:text-[32px]'>
              {moodData.highestMood.toLocaleUpperCase()}
            </p>
          </Card>
          <div className='px-8 flex flex-col gap-4 pb-8 md:pb-[46px] md:gap-[28px]'>
            <h2 className='font-medium md:text-2xl md:mt-[38px]'>Summary</h2>
            <ul className='flex flex-col gap-4'>
              {Object.entries(moodData.allMoods).map(([mood, score]) => (
                <li
                  className={`flex justify-between text-sm px-4 py-[18px] rounded-lg ${
                    moodBG[mood as keyof typeof moodBG]
                  } ${moodTextColor[mood as keyof typeof moodTextColor]}`}
                  key={mood}>
                  <span className='font-medium'>
                    {mood.toLocaleUpperCase()}
                  </span>
                  <span className='font-bold'>{score.toFixed(1)}%</span>
                </li>
              ))}
            </ul>
            <Button className='rounded-[288px] py-8 text-[18px] flex gap-3 items-center'>
              <span>Share</span>
              <ShareIcon size={18} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Mood;
