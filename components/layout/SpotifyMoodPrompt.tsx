import SpotifyButton from '../SpotifyButton';

const SpotifyMoodPrompt = () => {
  return (
    <>
      <h2 className='text-2xl md:text-4xl font-bold text-center my-4'>
        Discover Your Mood
      </h2>
      <p className='text-center mb-6'>
        Connect with Spotify to analyze your mood based on recently played
        songs.
      </p>
      <SpotifyButton />
    </>
  );
};

export default SpotifyMoodPrompt;
