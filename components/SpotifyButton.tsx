'use client';

import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';
import SpotifyLogo from '../assets/images/Spotify_Icon_RGB_Green.png';
import { Button } from './ui/button';

const SpotifyButton = () => {
  async function signInWithSpotify() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'spotify',
        options: {
          scopes: 'user-read-recently-played user-top-read',
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

  return (
    <Button
      onClick={signInWithSpotify}
      className='flex gap-2 items-center hover:bg-white hover:text-black duration-300 transition-all'>
      <Image alt='spotify logo' width={20} height={20} src={SpotifyLogo} />
      <div className='font-medium'>Login with Spotify</div>
    </Button>
  );
};

export default SpotifyButton;
