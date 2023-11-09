import SpotifyIcon from '@/assets/images/Spotify_Icon_RGB_Green.png';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { TrackDetail } from '@/utils/spotify/spotify';
import { Filter } from 'lucide-react';
import { useEffect, useState } from 'react';

// Types
interface RecentlyPlayedProps {
  recentTracks: TrackDetail[];
  selectedMood: string | null;
  setSelectedMood: (mood: string | null) => void;
}

interface MoodSelectItemProps {
  mood: string;
}

// Main Component
const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({
  recentTracks,
  selectedMood,
  setSelectedMood,
}) => {
  // Local State
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  const [filteredTracks, setFilteredTracks] = useState<TrackDetail[]>([]);

  // Subcomponents
  const MoodSelectItem: React.FC<MoodSelectItemProps> = ({ mood }) => (
    <SelectItem
      value={mood.toLowerCase()}
      onClick={() => {
        const newMood = mood.toLowerCase();
        console.log(`Selected mood: ${newMood}`);
        setSelectedMood(newMood);
      }}>
      {mood}
    </SelectItem>
  );
  // Functions
  useEffect(() => {
    const filterTracksByMood = () => {
      if (!selectedMood) {
        setFilteredTracks(recentTracks);
        return;
      }

      const selectedMoodLower = selectedMood.toLowerCase();

      const newFilteredTracks = recentTracks.filter((track) => {
        // Check if the track's mood is the selected mood
        return track.mood.toLocaleLowerCase() === selectedMoodLower;
      });

      setFilteredTracks(newFilteredTracks);
    };

    filterTracksByMood();
  }, [recentTracks, selectedMood]);

  const handleImageLoaded = (imageId: string) => {
    setImageLoaded((prev) => ({ ...prev, [imageId]: true }));
  };

  const moods = [
    'Joyful',
    'Relaxed',
    'Sad',
    'Energetic',
    'Angry',
    'Reflective',
  ];

  return (
    <div className='mt-20 mb-10 flex flex-col'>
      <div className='flex flex-col md:flex-row justify-between items-center'>
        <h2 className='text-lg md:text-2xl mb-6 font-medium'>Recent Played</h2>
        <div className='flex mb-8 items-center justify-end gap-4'>
          <Filter />
          <Select
            onValueChange={(value) => {
              setSelectedMood(value === 'Reset' ? '' : value);
              console.log(`Selected mood: ${value}`);
            }}>
            <SelectTrigger className='bg-transparent w-[180px]'>
              <SelectValue placeholder='Filter by mood' />
            </SelectTrigger>
            <SelectContent className='bg-primary text-primary-foreground'>
              <SelectGroup>
                {moods.map((mood) => (
                  <MoodSelectItem mood={mood} key={mood} />
                ))}
                <SelectItem className='border-t' value='Reset'>
                  Reset
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ul className='flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3'>
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track: TrackDetail, index) => (
            <li
              className='hover:scale-[105%] transition-all duration-300 w-full'
              key={`${track.id}-${index}`}>
              <Card className='w-full flex items-center gap-6 bg-primary text-primary-foreground border-none drop-shadow-2xl'>
                {!imageLoaded[track.id] && (
                  <Skeleton className='w-1/4 h-[100px]' />
                )}
                <img
                  className={`w-1/4 ${
                    imageLoaded[track.id] ? 'block' : 'hidden'
                  }`}
                  src={track.coverArt ? track.coverArt : SpotifyIcon.src}
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
          ))
        ) : (
          <p>No tracks match the selected mood filter.</p>
        )}
      </ul>
    </div>
  );
};

export default RecentlyPlayed;
