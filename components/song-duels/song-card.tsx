// components/SongCard.tsx
import { Song } from '@/utils/spotify/constants';
import Image from 'next/image';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

type SongCardProps = {
  song: Song;
  onPlay: (songId: string) => void;
  onVote: (song: Song) => void;
  voteCount: number;
  isVoting: boolean;
};

const SongCard: React.FC<SongCardProps> = ({
  song,
  onPlay,
  onVote,
  voteCount,
  isVoting,
}) => {
  return (
    <div className='card text-sm md:text-base p-0 pb-4 border-none flex flex-col max-w-[300px] mx-auto items-center rounded-t-none'>
      <div className='card-header p-0 w-full h-full'>
        <Image
          width={300}
          height={300}
          className='w-full h-full object-cover'
          src={song.album.images[0]?.url || ''}
          alt={`Cover art for ${song.name}`}
        />
      </div>
      <div className='p-2 flex flex-col gap-3'>
        <div>
          <h2 className='font-bold text-sm'>{song.name}</h2>
          <p className='text-muted-foreground text-sm'>
            {song.artists.map((artist) => artist.name).join(', ')}
          </p>
        </div>
        {song.preview_url && (
          <AudioPlayer
            className='audio-player !border-none'
            src={song.preview_url}
            onPlay={() => onPlay(song.id)}
          />
        )}
        <div className='text-center font-bold'>
          {isVoting ? `Votes: ${voteCount}` : ''}
        </div>
        <button
          className='vote-button justify-center w-full text-white'
          onClick={() => onVote(song)}>
          Vote
        </button>
      </div>
    </div>
  );
};

export default SongCard;
