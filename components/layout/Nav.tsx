import MoodWavLogo from '@/assets/images/moodwav-high-resolution-logo-transparent.png';
import MoodWavIcon from '@/assets/images/moodwav-icon-only-white.png';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Nav = () => {
  const router = useRouter();

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      sessionStorage.clear();

      // Redirect to login or home page after successful sign out
      router.push('/');

      // Log the user out spotify account
      const url = 'https://accounts.spotify.com/en/logout';
      const spotifyLogoutWindow = window.open(
        url,
        'Spotify Logout',
        'width=700,height=500,top=40,left=40'
      );
      setTimeout(() => {
        if (spotifyLogoutWindow) {
          spotifyLogoutWindow.close();
        }
      }, 2000);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <div className='container mt-6'>
      <div className='flex justify-between items-center'>
        <Link href='/' className='hidden md:block'>
          <Image
            className='hidden md:block'
            src={MoodWavLogo}
            alt='MoodWav Logo'
            width={150}
            height={150}
          />
        </Link>
        <Link href='/' className='md:hidden'>
          <Image
            className='md:hidden'
            src={MoodWavIcon}
            alt='MoodWav Logo'
            width={50}
            height={150}
          />
        </Link>
        <NavigationMenu>
          <NavigationMenuList className='flex gap-4 justify-between'>
            <NavigationMenuItem>
              <Link href='/how-it-works' legacyBehavior passHref>
                <NavigationMenuLink className='hover:underline '>
                  How It Works
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button
                onClick={async () => {
                  await signOut();
                }}
                className='hover:underline'>
                Sign out
              </button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Nav;
