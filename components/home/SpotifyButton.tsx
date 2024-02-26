"use client";

import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import { Button } from "../ui/button";
import SpotifyLogo from "/assets/images/Spotify_Icon_RGB_Green.png";

const SpotifyButton = () => {
  async function signInWithSpotify() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "spotify",
        options: {
          scopes:
            "user-read-recently-played user-top-read streaming user-read-playback-state user-modify-playback-state user-follow-read user-library-modify user-library-read",
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }

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
