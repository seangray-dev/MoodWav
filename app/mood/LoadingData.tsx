import { Loader2 } from 'lucide-react';

const LoadingData = () => {
  return (
    <div className='moodring flex flex-1 w-full justify-center place-content-center flex-col'>
      <div className='mx-auto flex flex-col gap-4 font-medium'>
        <Loader2 className='h-10 w-10 animate-spin mx-auto' />
        <p>Analyzing Your Mood...</p>
      </div>
    </div>
  );
};

export default LoadingData;
