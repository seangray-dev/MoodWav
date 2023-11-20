import { useRouter } from 'next/navigation';
import SpotifyButton from '../SpotifyButton';
import { Button } from '../ui/button';

const SpotifyMoodPrompt = () => {
  const router = useRouter();

  const handleRequestAccess = () => {
    router.push('/request-access');
  };

  return (
    <>
      <h2 className='text-2xl md:text-4xl font-bold text-center my-4'>
        Discover Your Mood
      </h2>
      {/* <p className='text-center mb-6'>
        Connect with Spotify to analyze your mood based on recently played
        songs.
      </p> */}
      <div className='text-center mb-6'>
        Currently access to MoodWav is by invitation only due to Spotify API
        restrictions.
      </div>
      <div className='flex flex-col md:flex-row justify-center gap-2'>
        <SpotifyButton />
        <Button onClick={handleRequestAccess} variant={'secondary'}>
          Request Access
        </Button>
      </div>
    </>
  );
};

export default SpotifyMoodPrompt;
