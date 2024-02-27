import Link from "next/link";
import { Button } from "../ui/button";
import SpotifyButton from "./SpotifyButton";

const SpotifyMoodPrompt = () => {
  return (
    <section className="text-card-foreground">
      <h2 className="mb-4 text-center text-2xl font-bold md:text-4xl">
        Discover Your Mood
      </h2>
      <p className="mb-6 max-w-[60ch] text-center text-xl">
        Uncover the soundtrack of your emotions, explore your top artists and
        tracks, and engage in Song Duels to discover new songs tailored for you.
      </p>
      <p className="mb-6 text-center">
        Currently access to MoodWav is by invitation only due to Spotify API
        restrictions.
      </p>
      <div className="flex flex-col justify-center gap-2 md:flex-row">
        <SpotifyButton />
        <Button>
          <Link href={"/request-access"}>Request Access</Link>
        </Button>
      </div>
    </section>
  );
};

export default SpotifyMoodPrompt;
