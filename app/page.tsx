import SpotifyButton from '@/components/SpotifyButton';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import SpotifyMoodPrompt from '@/components/layout/SpotifyMoodPrompt';

export default async function Index() {
  return (
    <>
      <div className='flex-1 w-full flex flex-col items-center'>
        <Header />
        <div className='flex-1 flex flex-col place-content-center container'>
          <SpotifyMoodPrompt />
        </div>
      </div>
      <Footer />
    </>
  );
}
