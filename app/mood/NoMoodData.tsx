import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const NoMoodData = () => {
  return (
    <div className='moodring flex flex-1 w-full justify-center place-content-center flex-col'>
      <div className='mx-auto px-2'>
        <Alert
          variant={'destructive'}
          className='bg-destructive text-white font-medium'>
          <div className='flex items-center gap-2'>
            <AlertCircle stroke='white' />
            <span>
              Mood scores are currently not available. Ensure you have listened
              to some tracks recently and try again.
            </span>
          </div>
        </Alert>
      </div>
    </div>
  );
};

export default NoMoodData;
