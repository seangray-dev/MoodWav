"use client";

import NoMoodData from "@/app/mood/NoMoodData";
import { Card } from "@/components/ui/card";
import { fetchUserMoodData } from "@/server/actions";
import { fetchAccessToken } from "@/utils/supabase/fecthAccessToken";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MoodScoreCardSkeleton } from "./Skeletons";

interface MoodData {
  highestMood: string;
  highestScore: number;
  allMoods: Record<string, number>;
}

const MoodScoreCard = () => {
  const [moodData, setMoodData] = useState<MoodData | undefined>();
  const { data, error, isFetched, isLoading } = useQuery({
    queryKey: ["mood-data"],
    queryFn: async () => {
      const accessToken = await fetchAccessToken();
      return fetchUserMoodData(accessToken);
    },
  });

  if (error) {
    throw error;
  }

  useEffect(() => {
    if (data) {
      setMoodData(data);
    }
  }, [data]);

  // Safeguard to ensure moodData and allMoods are defined
  const allMoods = moodData?.allMoods || {};

  const moodBG = {
    blissful: "bg-yellow-200",
    serenity: "bg-green-300",
    melancholic: "bg-blue-300",
    vibrant: "bg-orange-300",
    nostalgic: "bg-red-300",
    reflective: "bg-indigo-300",
  };

  const moodTextColor = {
    blissful: "text-yellow-900",
    serenity: "text-green-900",
    melancholic: "text-blue-900",
    vibrant: "text-orange-900",
    nostalgic: "text-red-900",
    reflective: "text-indigo-900",
  };

  const moodGradient = {
    blissful: "bg-gradient-to-b from-yellow-400 to-yellow-300",
    serenity: "bg-gradient-to-b from-green-400 to-green-300",
    melancholic: "bg-gradient-to-b from-blue-400 to-blue-300",
    vibrant: "bg-gradient-to-b from-orange-400 to-orange-300",
    nostalgic: "bg-gradient-to-b from-red-500 to-red-300",
    reflective: "bg-gradient-to-b from-indigo-400 to-indigo-300",
  };

  if (isLoading) {
    return <MoodScoreCardSkeleton />;
  }

  return (
    <Card className="mx-auto flex flex-1 flex-col gap-6 rounded-[32px] border-none bg-card drop-shadow-2xl md:grid md:grid-cols-2">
      <Card
        className={`flex flex-col gap-4 rounded-b-none rounded-t-[32px] border-transparent border-b-muted-foreground py-6 pb-10 md:flex md:flex-col md:place-content-center  md:justify-evenly md:gap-0
             md:rounded-none md:rounded-l-[32px] md:border-b-0 md:border-r md:border-r-muted-foreground
             `}
      >
        <p className="text-center text-lg font-medium text-card-foreground md:text-2xl">
          Your Mood
        </p>
        <div className="flex justify-center">
          <div
            className={`flex h-[140px] w-[140px] flex-col items-center justify-center rounded-full md:h-[200px] md:w-[200px] ${
              moodGradient[
                moodData?.highestMood.toLowerCase() as keyof typeof moodGradient
              ]
            } `}
          >
            <span className="text-[56px] font-bold text-white md:text-[72px]">
              {moodData?.highestScore.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="text-center text-2xl font-bold text-card-foreground md:text-[32px]">
          {moodData?.highestMood.toLocaleUpperCase()}
        </p>
      </Card>
      <div className="flex flex-col gap-4 px-8 pb-8 md:gap-[28px] md:pb-[46px]">
        <h2 className="font-medium text-card-foreground md:mt-[38px] md:text-2xl">
          Summary
        </h2>
        <ul className="flex flex-col gap-4">
          {Object.entries(allMoods).map(([mood, score]) => (
            <li
              key={mood}
              className={`flex justify-between rounded-lg px-4 py-[18px] text-sm ${
                moodBG[mood as keyof typeof moodBG]
              } ${moodTextColor[mood as keyof typeof moodTextColor]}`}
            >
              <span className="font-medium">{mood.toLocaleUpperCase()}</span>
              <span className="font-bold">{score.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default MoodScoreCard;
