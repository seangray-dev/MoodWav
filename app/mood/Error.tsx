import Nav from '@/components/layout/Nav';
import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const ErrorAlert = () => {
  return (
    <div className='mx-auto flex flex-1 flex-col justify-center'>
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
  );
};

export default ErrorAlert;
