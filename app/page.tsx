import ConnectSupabaseSteps from '@/components/ConnectSupabaseSteps';
import Header from '@/components/Header';
import SignUpUserSteps from '@/components/SignUpUserSteps';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import AuthButton from '../components/AuthButton';

export default async function Index() {
  const cookieStore = cookies();

  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient(cookieStore);
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className='flex-1 w-full flex flex-col items-center'>
      {/* <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
        <div className='w-full max-w-4xl flex justify-between items-center p-3 text-sm'>
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav> */}

      <div className='animate-in flex-1 flex flex-col gap-20 opacity-0 w-full'>
        <Header />
        <main className='flex-1 flex flex-col gap-6'>
          {/* <h2 className='font-bold text-4xl mb-4'>Next steps</h2> */}
          {/* {isSupabaseConnected ? <SignUpUserSteps /> : <ConnectSupabaseSteps />} */}
        </main>
      </div>

      <footer className='w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs'>
        <p>
          Built by{' '}
          <a
            href='https://www.seangray.tech'
            target='_blank'
            className='font-bold hover:underline'
            rel='noreferrer'>
            Sean Gray
          </a>
        </p>
      </footer>
    </div>
  );
}
