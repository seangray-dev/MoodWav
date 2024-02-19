import Nav from '@/components/layout/Nav';
import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const NoMoodData = () => {
  return (
    <div className='mx-auto flex flex-1 flex-col justify-center px-2'>
      <Alert
        variant={'destructive'}
        className='bg-destructive text-white font-medium'>
        <div className='flex items-center gap-2'>
          <AlertCircle stroke='white' />
          <span>
            Mood scores are currently not available. Ensure you have listened to
            some tracks recently and try again.
          </span>
        </div>
      </Alert>
    </div>
  );
};

export default NoMoodData;
