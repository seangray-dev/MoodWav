import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function AlertMessage({ message }: { message: string }) {
  return (
    <div className='mx-auto flex flex-1 flex-col justify-center'>
      <Alert
        variant={'destructive'}
        className='bg-destructive text-white font-medium'>
        <div className='flex items-center gap-2'>
          <AlertCircle stroke='white' />
          <span>{message}</span>
        </div>
      </Alert>
    </div>
  );
}
