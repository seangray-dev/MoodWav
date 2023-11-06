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
      if (error) {
        console.error('Error fetching session:', error);
      } else if (session) {
        const accessToken = session.provider_token;
        const refreshToken = session.provider_refresh_token;

        if (typeof accessToken === 'string') {
          sessionStorage.setItem('spotifyAccessToken', accessToken);
        } else {
          console.error('Access token is not available.');
        }

        if (typeof refreshToken === 'string') {
          sessionStorage.setItem('spotifyRefreshToken', refreshToken);
        } else {
          console.error('Refresh token is not available.');
        }

        router.push('/mood');
      }
    });
  }, [router]);

  return (
    <>
      <div className='flex-1 w-full flex flex-col items-center moodring'>
        <div className='flex-1 flex flex-col place-content-center container'>
          <Header />
          <SpotifyMoodPrompt />
        </div>
        <Footer />
      </div>
    </>
  );
}
