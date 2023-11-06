'use client';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import SpotifyMoodPrompt from '@/components/layout/SpotifyMoodPrompt';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (session) {
        console.log(session);

        const accessToken = session.provider_token;
        const refreshToken = session.provider_refresh_token;

        sessionStorage.setItem('spotifyAccessToken', accessToken);
        sessionStorage.setItem('spotifyRefreshToken', refreshToken);

        router.push('/mood');
      }
    });
  }, [router]);

  return (
    <>
      <div className='flex-1 w-full flex flex-col items-center'>
        <Header />
        <div className='flex-1 flex flex-col place-content-center container'>
          <SpotifyMoodPrompt />
        </div>
      </div>
      <Footer />
    </>
  );
}
