// import SongCards from '@/components/song-duels/song-cards';
import SongCards from '@/components/song-duels/song-cards-copy';

export default function SongDuelsPage() {
  return (
    <div className='my-10 w-full'>
      <div className='mb-10 flex flex-col gap-2'>
        <h1 className='text-2xl 2xl:text-6xl md:text-4xl font-bold'>
          Song Duels
        </h1>
        <p className='max-w-[70ch]'>
          A new way to discover music that's tailored just for you! Dive into a
          dynamic face-off between two randomly selected tracks and decide which
          one hits the right note for you.
        </p>
      </div>
      <SongCards />
    </div>
  );
}
