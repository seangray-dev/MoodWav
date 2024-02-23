import { Card } from '../ui/card';

export const TopArtistsSkeleton = () => {
  return Array.from({ length: 20 }).map((_, idx) => (
    <div key={idx} className='h-full w-full'>
      <Card className='w-full h-full flex rounded-none rounded-r-md items-center gap-6 bg-card border-none drop-shadow-2xl'>
        <div className='w-24 h-24 2xl:w-36 2xl:h-36 bg-muted-foreground animate-pulse'></div>
        <div className='flex flex-col gap-2 overflow-hidden'>
          <div className='w-[200px] h-4 bg-muted-foreground animate-pulse rounded-full'></div>
          <div className='w-[200px] h-4 bg-muted-foreground animate-pulse rounded-full'></div>
          <div className='w-[100px] h-4 bg-muted-foreground animate-pulse rounded-full'></div>
        </div>
      </Card>
    </div>
  ));
};
