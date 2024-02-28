"use client";

import MoodWavIconBlack from "@/assets/images/moodwav-icon-only-black.png";
import MoodWavIconWhite from "@/assets/images/moodwav-icon-only-white.png";
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
import { Button } from "../ui/button";
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
    <div className="w-full border-b border-b-card-foreground py-4">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Image
            className="hidden h-[15px] w-[50px] dark:block"
            src={MoodWavIconWhite}
            alt="MoodWav Logo"
            width={50}
            height={15}
          />
          <Image
            className="h-[15px] w-[50px] dark:hidden"
            src={MoodWavIconBlack}
            alt="MoodWav Logo"
            width={50}
            height={15}
          />
        </Link>

        {/* Mobile Menu */}
        <div className="flex items-center md:hidden">
          <ModeToggle />
          <Menubar className="border-none bg-transparent hover:bg-secondary">
            <MenubarMenu>
              <MenubarTrigger>
                <MenuIcon className="cursor-pointer text-card-foreground" />
              </MenubarTrigger>
              <MenubarContent className="bg-card text-card-foreground md:hidden">
                {navItems.map((item) => (
                  <MenubarItem key={item.path} className="hover:underline">
                    <Link href={item.path} legacyBehavior passHref>
                      <a className="relative flex w-full items-center gap-3">
                        {item.title}
                        {item.isNew && (
                          <Badge className="bg-card-foreground p-1 text-[10px] text-black text-card hover:bg-card-foreground dark:text-card">
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
                    <MenubarItem className="hover:underline">
                      <div
                        className="flex w-full items-center gap-2"
                        onClick={async () => {
                          await signOut();
                        }}
                      >
                        Sign out
                        <LogOutIcon
                          size={16}
                          className="text-card-foreground"
                        />
                      </div>
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
                  <NavigationMenuLink className="relative text-card-foreground hover:underline">
                    {item.title}
                    {item.isNew && (
                      <Badge className="absolute -right-7 -top-5 rotate-[15deg] bg-card-foreground p-1 text-[10px] text-card hover:bg-card">
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
                  <Button
                    variant={"ghost"}
                    onClick={async () => {
                      await signOut();
                    }}
                    className="text-card-foreground hover:underline"
                  >
                    Sign out
                  </Button>
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
