import MoodWavLogo from '@/assets/images/moodwav-high-resolution-logo-transparent.png';
import Image from 'next/image';

export default function Header() {
  return (
    <header className='flex flex-col gap-16 items-center w-full mb-10'>
      <div className='flex gap-4 justify-center items-center max-w-[300px] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl'>
        <Image
          src={MoodWavLogo}
          alt={'mood wav logo'}
          width={300}
          height={300}
          layout='responsive'
        />
      </div>
      <h1 className='sr-only'>MoodWav</h1>
    </header>
  );
}
