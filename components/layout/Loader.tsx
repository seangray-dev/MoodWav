import { Loader2 } from 'lucide-react';

export default function Loader({ ...props }) {
  return (
    <div className='flex flex-col gap-2 items-center justify-center'>
      <Loader2 className='mr-2 h-8 w-8 animate-spin' />
      <span className='text-xl'>{props.message}</span>
    </div>
  );
}
