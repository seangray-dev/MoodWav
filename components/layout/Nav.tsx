import MoodWavIcon from '@/assets/images/moodwav-icon-only-white.png';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  SpotifyUserProfile,
  fetchSpotifyUserProfile,
} from '@/utils/spotify/spotify';
import { supabase } from '@/utils/supabase/client';
import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Nav = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<SpotifyUserProfile | null>(
    null
  );

  useEffect(() => {
    const accessToken = sessionStorage.getItem('spotifyAccessToken');
    if (accessToken) {
      fetchSpotifyUserProfile(accessToken).then((profile) => {
        setUserProfile(profile);
      });
    }
  }, []);

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
        <Link href='/'>
          <Image src={MoodWavIcon} alt='MoodWav Logo' width={50} height={50} />
        </Link>

        {/* Mobile Menu */}
        <Menubar className='bg-transparent border-none md:hidden'>
          <MenubarMenu>
            <MenubarTrigger>
              <MenuIcon></MenuIcon>
            </MenubarTrigger>
            <MenubarContent className='bg-secondary-foreground text-white md:hidden'>
              <MenubarItem className='hover:underline'>
                <Link href='/how-it-works' legacyBehavior passHref>
                  How It Works
                </Link>
              </MenubarItem>
              {userProfile && (
                <>
                  <MenubarSeparator />
                  <MenubarItem className='hover:underline'>
                    <button
                      onClick={async () => {
                        await signOut();
                      }}>
                      Sign out
                    </button>
                  </MenubarItem>
                </>
              )}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        {/* Desktop Menu */}
        <NavigationMenu className='hidden md:block'>
          <NavigationMenuList className='md:flex gap-4 justify-between hidden'>
            <NavigationMenuItem>
              <Link href='/how-it-works' legacyBehavior passHref>
                <NavigationMenuLink className='hover:underline '>
                  How It Works
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {userProfile && (
              <>
                <NavigationMenuItem className='text-right'>
                  <button
                    onClick={async () => {
                      await signOut();
                    }}
                    className='hover:underline'>
                    Sign out
                  </button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <TooltipProvider>
                    {userProfile.images.length > 0 && (
                      <>
                        <Tooltip>
                          <TooltipTrigger>
                            <img
                              src={userProfile.images[0].url}
                              alt={`${userProfile.display_name}'s Profile Picture`}
                              className='rounded-full h-10 w-10'
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <span>{userProfile.display_name}</span>
                          </TooltipContent>
                        </Tooltip>
                      </>
                    )}
                  </TooltipProvider>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Nav;
