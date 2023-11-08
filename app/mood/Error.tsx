import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const ErrorAlert = () => {
  return (
    <div className='moodring flex flex-1 w-full justify-center place-content-center flex-col'>
      <div className='mx-auto'>
        <Alert
          variant={'destructive'}
          className='bg-destructive text-white font-medium'>
          <div className='flex items-center gap-2'>
            <AlertCircle stroke='white' />
            <span>
              Error: Please check your Spotify connection or try refreshing the
              page.
            </span>
          </div>
        </Alert>
      </div>
    </div>
  );
};

export default ErrorAlert;
