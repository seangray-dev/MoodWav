'use client';

import { Card } from '@/components/ui/card';
import { fetchUserMoodData } from '@/server/actions';
import { fetchAccessToken } from '@/utils/supabase/fecthAccessToken';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { MoodScoreCardSkeleton } from './Skeletons';

interface MoodData {
  highestMood: string;
  highestScore: number;
  allMoods: Record<string, number>;
}

const MoodScoreCard = () => {
  const [moodData, setMoodData] = useState<MoodData | undefined>();
  const { data, error, isFetched, isLoading } = useQuery({
    queryKey: ['mood-data'],
    queryFn: async () => {
      const accessToken = await fetchAccessToken();
      return fetchUserMoodData(accessToken);
    },
  });

  useEffect(() => {
    if (data) {
      setMoodData(data);
    }
  }, [data]);

  // Safeguard to ensure moodData and allMoods are defined
  const allMoods = moodData?.allMoods || {};

  const moodBG = {
    blissful: 'bg-yellow-200',
    serenity: 'bg-green-300',
    melancholic: 'bg-blue-300',
    vibrant: 'bg-orange-300',
    nostalgic: 'bg-red-300',
    reflective: 'bg-indigo-300',
  };

  const moodTextColor = {
    blissful: 'text-yellow-900',
    serenity: 'text-green-900',
    melancholic: 'text-blue-900',
    vibrant: 'text-orange-900',
    nostalgic: 'text-red-900',
    reflective: 'text-indigo-900',
  };

  const moodGradient = {
    blissful: 'bg-gradient-to-b from-yellow-400 to-yellow-300',
    serenity: 'bg-gradient-to-b from-green-400 to-green-300',
    melancholic: 'bg-gradient-to-b from-blue-400 to-blue-300',
    vibrant: 'bg-gradient-to-b from-orange-400 to-orange-300',
    nostalgic: 'bg-gradient-to-b from-red-500 to-red-300',
    reflective: 'bg-gradient-to-b from-indigo-400 to-indigo-300',
  };

  if (isLoading) {
    return <MoodScoreCardSkeleton />;
  }

  return (
    <Card className='flex-1 border-none mx-auto flex flex-col gap-6 md:grid md:grid-cols-2 rounded-[32px] bg-card drop-shadow-2xl'>
      <Card
        className={`md:flex md:flex-col md:place-content-center md:gap-0 md:justify-evenly md:rounded-none md:rounded-l-[32px] flex flex-col gap-4 pb-10 py-6  rounded-t-[32px] rounded-b-none
             border-transparent md:border-r md:border-r-muted-foreground border-b-muted-foreground md:border-b-0
             `}>
        <p className='text-center font-medium text-lg md:text-2xl text-card-foreground'>
          Your Mood
        </p>
        <div className='flex justify-center'>
          <div
            className={`flex flex-col justify-center items-center rounded-full w-[140px] h-[140px] md:w-[200px] md:h-[200px] ${
              moodGradient[
                moodData?.highestMood.toLowerCase() as keyof typeof moodGradient
              ]
            } `}>
            <span className='text-[56px] md:text-[72px] text-white font-bold'>
              {moodData?.highestScore.toFixed(1)}
            </span>
          </div>
        </div>
        <p className='text-center text-card-foreground text-2xl font-bold md:text-[32px]'>
          {moodData?.highestMood.toLocaleUpperCase()}
        </p>
      </Card>
      <div className='px-8 flex flex-col gap-4 pb-8 md:pb-[46px] md:gap-[28px]'>
        <h2 className='text-card-foreground font-medium md:text-2xl md:mt-[38px]'>
          Summary
        </h2>
        <ul className='flex flex-col gap-4'>
          {Object.entries(allMoods).map(([mood, score]) => (
            <li
              key={mood}
              className={`flex justify-between text-sm px-4 py-[18px] rounded-lg ${
                moodBG[mood as keyof typeof moodBG]
              } ${moodTextColor[mood as keyof typeof moodTextColor]}`}>
              <span className='font-medium'>{mood.toLocaleUpperCase()}</span>
              <span className='font-bold'>{score.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default MoodScoreCard;
