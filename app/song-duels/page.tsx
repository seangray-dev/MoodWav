import SongCards from "@/components/song-duels/SongCards";
import Stats from "@/components/song-duels/Stats";
import TotalFavourited from "@/components/song-duels/TotalFavourited";
import TotalVotes from "@/components/song-duels/TotalVotes";

export default function SongDuelsPage() {
  return (
    <div className="relative flex w-full flex-1 flex-col justify-between">
      <div className="flex flex-col gap-10">
        <Stats />
        <header className="mb-8 flex flex-col gap-4">
          <h1 className="text-2xl font-bold md:text-4xl 2xl:text-6xl">
            Song Duels
          </h1>
          <p className="max-w-[70ch]">
            A new way to discover music that's tailored just for you! Dive into
            a dynamic face-off between two randomly selected tracks and decide
            which one hits the right note for you.
          </p>
        </header>
        <SongCards />
      </div>
    </div>
  );
}
