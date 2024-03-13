import Loader from '../layout/Loader';
import { Card } from '../ui/card';

// Skeleton component for the track list item
export const RecentTracksSkeleton = () => {
  return Array.from({ length: 9 }).map((_, idx) => (
    <li key={idx} className='md:w-[413px] h-[100px]'>
      <Card className='w-full h-full flex rounded-none rounded-r-md items-center gap-6 bg-card border-none drop-shadow-2xl'>
        <div className='w-1/4 h-full max-h-[100px] bg-muted-foreground animate-pulse'></div>
        <div className='flex flex-col gap-2 overflow-hidden'>
          <div className='w-[200px] h-4 bg-muted-foreground animate-pulse rounded-full'></div>
          <div className='w-[100px] h-4 bg-muted-foreground animate-pulse rounded-full'></div>
        </div>
      </Card>
    </li>
  ));
};

// MoodScoreCard Skeleton
export const MoodScoreCardSkeleton = () => {
  return (
    <Card className='flex-1 border-none mx-auto flex flex-col gap-6 md:grid md:grid-cols-2 rounded-[32px] bg-card drop-shadow-2xl'>
      <Card className='md:flex md:flex-col md:place-content-center md:gap-0 md:justify-evenly md:rounded-none md:rounded-l-[32px] flex flex-col gap-4 pb-10 py-6 rounded-t-[32px] rounded-b-none border-transparent md:border-r md:border-r-muted-foreground border-b-muted-foreground md:border-b-0'>
        <div className='flex flex-col items-center gap-2 justify-center mt-6'>
          <Loader />
          Analyzing Your Mood...
        </div>
      </Card>
      <div className='px-8 flex flex-col gap-6 py-10 md:pb-[56px] md:gap-[32px]'>
        <div className='h-8 bg-muted-foreground rounded w-1/3  animate-pulse'></div>
        <ul className='flex flex-col gap-6'>
          {Array.from({ length: 5 }).map((_, idx) => (
            <li
              key={idx}
              className='h-14 bg-muted-foreground rounded w-full animate-pulse'></li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
