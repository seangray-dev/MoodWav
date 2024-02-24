"use client";

import MoodWavIcon from "@/assets/images/moodwav-icon-only-white.png";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { navItems } from "@/data/navigation";
import { SpotifyUserProfile } from "@/utils/spotify/constants";
import { fetchSpotifyUserProfile } from "@/utils/spotify/spotify";
import { supabase } from "@/utils/supabase/client";
import { LogOutIcon, MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { ModeToggle } from "../ui/mode-toggle";

const Nav = () => {
  const router = useRouter();
  // Local State
  const [userProfile, setUserProfile] = useState<SpotifyUserProfile | null>(
    null,
  );

  // Functions
  useEffect(() => {
    const fetchProfileData = async () => {
      // Retrieve the current session
      const { data: session, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error retrieving user session:", error);
        return;
      }

      if (!session.session?.provider_token) {
        console.error("No provider token available in session");
        return;
      }

      const accessToken = session.session?.provider_token;
      try {
        const profile = await fetchSpotifyUserProfile(accessToken);
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching Spotify user profile:", error);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          setUserProfile(null);
          router.push("/");
        } else if (event === "SIGNED_IN" && session) {
          const accessToken = session.provider_token;
          if (accessToken) {
            const profile = await fetchSpotifyUserProfile(accessToken);
            setUserProfile(profile);
          }
        }
      },
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUserProfile(null);

      // Log the user out spotify account
      const url = "https://accounts.spotify.com/en/logout";
      const spotifyLogoutWindow = window.open(
        url,
        "Spotify Logout",
        "width=700,height=500,top=40,left=40",
      );
      setTimeout(() => {
        if (spotifyLogoutWindow) {
          spotifyLogoutWindow.close();
        }
      }, 2000);
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <div className="w-full border-b py-4">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Image src={MoodWavIcon} alt="MoodWav Logo" width={50} height={50} />
        </Link>

        {/* Mobile Menu */}
        <div className="flex items-center md:hidden">
          <ModeToggle />
          <Menubar className="border-none bg-transparent">
            <MenubarMenu>
              <MenubarTrigger>
                <MenuIcon></MenuIcon>
              </MenubarTrigger>
              <MenubarContent className="bg-card text-card-foreground md:hidden">
                {navItems.map((item) => (
                  <MenubarItem key={item.path} className="hover:underline">
                    <Link href={item.path} legacyBehavior passHref>
                      <a className="relative flex items-center gap-2">
                        {item.title}
                        {item.isNew && (
                          <Badge className="bg-card p-1 text-[10px] text-black hover:bg-card dark:text-foreground">
                            New!
                          </Badge>
                        )}
                      </a>
                    </Link>
                  </MenubarItem>
                ))}
                {userProfile && (
                  <>
                    <MenubarSeparator />
                    <MenubarItem className="flex items-center gap-2 hover:underline">
                      <button
                        onClick={async () => {
                          await signOut();
                        }}
                      >
                        Sign out
                      </button>
                      <LogOutIcon size={16} className="text-card-foreground" />
                    </MenubarItem>
                  </>
                )}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>

        {/* Desktop Menu */}
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList className="hidden justify-between gap-7 md:flex">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.path}>
                <Link href={item.path} legacyBehavior passHref>
                  <NavigationMenuLink className="relative hover:underline">
                    {item.title}
                    {item.isNew && (
                      <Badge className="absolute -right-7 -top-5 rotate-[15deg] bg-card p-1 text-[10px] text-black hover:bg-card dark:text-foreground">
                        New!
                      </Badge>
                    )}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <ModeToggle />
            </NavigationMenuItem>
            {userProfile && (
              <>
                <NavigationMenuItem className="text-right">
                  <button
                    onClick={async () => {
                      await signOut();
                    }}
                    className="hover:underline"
                  >
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
                              className="h-10 w-10 rounded-full"
                            />
                          </TooltipTrigger>
                          <TooltipContent className="flex gap-2">
                            <span>Signed in as: </span>
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
