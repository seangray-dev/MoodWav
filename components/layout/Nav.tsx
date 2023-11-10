import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

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
    <div className='flex justify-end container mt-6'>
      <NavigationMenu>
        <NavigationMenuList className='flex gap-4'>
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
  );
};

export default Nav;
