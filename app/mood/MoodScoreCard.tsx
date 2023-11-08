import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShareIcon } from 'lucide-react';

interface MoodData {
  highestMood: string;
  highestScore: number;
  allMoods: Record<string, number>;
}

interface MoodScoreCardProps {
  moodData: MoodData;
}

const MoodScoreCard: React.FC<MoodScoreCardProps> = ({ moodData }) => {
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

  return (
    <Card className='flex-1 border-none mx-auto flex flex-col gap-6 md:grid md:grid-cols-2 rounded-[32px] bg-primary drop-shadow-2xl'>
      <Card
        className={`md:flex md:flex-col md:place-content-center md:gap-0 md:justify-evenly  md:rounded-none md:rounded-l-[32px] flex flex-col gap-4 pb-10 py-6  rounded-t-[32px] rounded-b-none
            bg-primary border-transparent md:border-r md:border-r-muted-foreground border-b-muted-foreground md:border-b-0 
             `}>
        <p className='text-center font-medium text-lg text-muted md:text-2xl'>
          Your Mood
        </p>
        <div className='flex justify-center'>
          <div
            className={`flex flex-col justify-center items-center rounded-full w-[140px] h-[140px] md:w-[200px] md:h-[200px] ${
              moodGradient[
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
        <h2 className='text-white font-medium md:text-2xl md:mt-[38px]'>
          Summary
        </h2>
        <ul className='flex flex-col gap-4'>
          {Object.entries(moodData.allMoods).map(([mood, score]) => (
            <li
              className={`flex justify-between text-sm px-4 py-[18px] rounded-lg ${
                moodBG[mood as keyof typeof moodBG]
              } ${moodTextColor[mood as keyof typeof moodTextColor]}`}
              key={mood}>
              <span className='font-medium'>{mood.toLocaleUpperCase()}</span>
              <span className='font-bold'>{score.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
        <Button className='rounded-[288px] py-8 text-[18px] flex gap-3 items-center bg-primary-foreground text-card-foreground hover:text-white hover:bg-transparent border border-white transition-all duration-300'>
          <span>Share</span>
          <ShareIcon size={18} />
        </Button>
      </div>
    </Card>
  );
};

export default MoodScoreCard;
