import SpotifyLogo from '@/assets/images/Spotify_Icon_RGB_Green.png';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrackDetail } from '@/utils/spotify/spotify';
import { useState } from 'react';

interface RecentlyPlayedProps {
  recentTracks: TrackDetail[];
}

const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({ recentTracks }) => {
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  const handleImageLoaded = (imageId: string) => {
    setImageLoaded((prev) => ({ ...prev, [imageId]: true }));
  };

  return (
    <div className='mt-20 mb-10 flex flex-col'>
      <h2 className='text-lg md:text-2xl mb-6 font-medium'>Recent Played</h2>
      <ul className='flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3'>
        {recentTracks.map((track) => (
          <li
            className='hover:scale-[105%] transition-all duration-300 w-full'
            key={track.id}>
            <Card className='w-full flex items-center gap-6 bg-primary text-primary-foreground border-none drop-shadow-2xl'>
              {!imageLoaded[track.id] && (
                <Skeleton className='w-1/4 h-[100px]' />
              )}
              <img
                className={`w-1/4 ${
                  imageLoaded[track.id] ? 'block' : 'hidden'
                }`}
                src={track.coverArt ? track.coverArt : SpotifyLogo.src}
                alt={track.name}
                onLoad={() => handleImageLoaded(track.id)}
              />
              <div className='flex flex-col gap-2 overflow-hidden'>
                <p className='font-bold truncate'>{track.name}</p>
                <p className='text-muted-foreground truncate'>
                  {track.artistName}
                </p>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentlyPlayed;
