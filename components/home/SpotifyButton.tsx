"use client";

import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import { Button } from "../ui/button";
import SpotifyLogo from "/assets/images/Spotify_Icon_RGB_Green.png";

const SpotifyButton = async () => {
  const signInWithSpotify = async () => {
    try {
      const response = await supabase.auth.signInWithOAuth({
        provider: "spotify",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
          scopes:
            "user-read-recently-played user-top-read streaming user-read-playback-state user-modify-playback-state user-follow-read user-library-modify user-library-read",
        },
      });

      const { data, error } = response;
      console.log(data);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <Button
      variant={"secondary"}
      onClick={signInWithSpotify}
      className="flex items-center gap-2 text-card-foreground transition-all duration-300"
    >
      <Image alt="spotify logo" width={20} height={20} src={SpotifyLogo} />
      <div className="font-medium">Login with Spotify</div>
    </Button>
  );
};

export default SpotifyButton;
