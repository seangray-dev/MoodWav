import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import SpotifyButton from './SpotifyButton';

const SpotifyMoodPrompt = () => {
  const router = useRouter();

  const handleRequestAccess = () => {
    router.push('/request-access');
  };

  return (
    <>
      <h2 className='text-2xl md:text-4xl font-bold text-center mb-4'>
        Discover Your Mood
      </h2>
      <p className='text-center text-xl mb-6 max-w-[60ch]'>
        Uncover the soundtrack of your emotions, explore your top artists and
        tracks, and engage in Song Duels to discover new songs tailored for you.
      </p>
      <p className='text-center mb-6'>
        Currently access to MoodWav is by invitation only due to Spotify API
        restrictions.
      </p>
      <div className='flex flex-col md:flex-row justify-center gap-2'>
        <SpotifyButton />
        <Button
          className='bg-white text-black hover:bg-black hover:text-white duration-300 transition-all'
          onClick={handleRequestAccess}>
          Request Access
        </Button>
      </div>
    </>
  );
};

export default SpotifyMoodPrompt;
