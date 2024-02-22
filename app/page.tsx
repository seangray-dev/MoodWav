'use client';

import Header from '@/components/home/Header';
import SpotifyMoodPrompt from '@/components/home/SpotifyMoodPrompt';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/mood');
      } else if (event === 'SIGNED_OUT') {
        // Handle the sign out event if needed
      }
    });

    // Clean up the listener when the component is unmounted
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className='w-full h-full flex flex-col justify-center items-center place-content-center font-'>
      <Header />
      <SpotifyMoodPrompt />
    </div>
  );
}
