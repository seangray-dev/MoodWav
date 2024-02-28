import SongCards from "@/components/song-duels/SongCards";
import Stats from "@/components/song-duels/Stats";
import AlertMessage from "@/components/ui/AlertMessage";
import readUserSession from "@/server/read-user-session";
import Link from "next/link";

export default async function SongDuelsPage() {
  const { data } = await readUserSession();
  if (!data.session) {
    return (
      <AlertMessage message="You must be logged in to use this feature." />
    );
  }
  return (
    <div className="relative flex w-full flex-1 flex-col justify-between">
      <div className="flex flex-col gap-10">
        <Stats />
        <header className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold md:text-4xl 2xl:text-6xl">
              Song Duels
            </h1>
            <p className="max-w-[70ch]">
              A new way to discover music that's tailored just for you! Dive
              into a dynamic face-off between two randomly selected tracks and
              decide which one hits the right note for you.
            </p>
          </div>
          <Link
            className="w-fit hover:text-primary hover:underline"
            href={"/song-duels/leaderboard"}
          >
            View the Leaderboard
          </Link>
        </header>
        <SongCards />
      </div>
    </div>
  );
}
