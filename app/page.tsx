'use client';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import SpotifyMoodPrompt from '@/components/layout/SpotifyMoodPrompt';
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
    <>
      <div className='flex-1 w-full flex flex-col items-center moodring'>
        <Nav />
        <div className='flex-1 flex flex-col place-content-center container'>
          <Header />
          <SpotifyMoodPrompt />
        </div>
        <Footer />
      </div>
    </>
  );
}
