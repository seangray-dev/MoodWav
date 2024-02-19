import { Loader2 } from 'lucide-react';

const LoadingData = () => {
  return (
    <div className='mx-auto flex flex-col gap-4 font-medium'>
      <Loader2 className='h-10 w-10 animate-spin mx-auto' />
      <p>Analyzing Your Mood...</p>
    </div>
  );
};

export default LoadingData;
