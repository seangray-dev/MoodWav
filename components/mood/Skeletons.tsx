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
