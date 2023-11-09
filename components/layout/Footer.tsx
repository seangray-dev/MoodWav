import SpotifyLogo from '@/assets/images/Spotify_Logo_RGB_Green.png';
import MoodWavLogo from '@/assets/images/moodwav-high-resolution-logo-transparent.png';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className='w-full border-t border-t-foreground/10 p-8 flex flex-col gap-10 justify-center text-xs md:flex-row md:justify-between md:container items-center'>
      <div className='flex flex-col gap-4'>
        {/* <p>
          Built by{' '}
          <a
            href='https://www.seangray.tech'
            target='_blank'
            className='font-bold hover:underline'
            rel='noreferrer'>
            Sean Gray
          </a>
        </p> */}
        <a href='/'>
          <Image
            className='mx-auto'
            src={MoodWavLogo}
            alt='moodwav logo'
            width={200}
            height={200}
          />
        </a>
      </div>
      <div className='flex items-center gap-4 justify-center'>
        <p>Powered by</p>
        <a target='_blank' href='https://spotify.com'>
          <img className='w-[100px]' src={SpotifyLogo.src} alt='spotify logo' />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
