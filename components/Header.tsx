import Image from 'next/image';
import MoodWavLogo from '../assets/images/moodwav-icon-only-white.png';
import MoodWavText from '../assets/images/moodwav-text-white-transparent.png';

export default function Header() {
  return (
    <div className='flex flex-col gap-16 items-center moodring py-40 '>
      <div className='flex gap-4 justify-center items-center '>
        {/* <div className=' px-3 py-6 rounded-lg'>
          <Image src={MoodWavLogo} width={50} height={50} alt='moodwav logo' />
        </div> */}
        <div>
          <Image src={MoodWavLogo} width={75} height={75} alt='moodwav logo' />
        </div>
        <Image src={MoodWavText} width={350} height={500} alt='moodwav logo' />
      </div>
      <h1 className='sr-only'>Supabase and Next.js Starter Template</h1>
    </div>
  );
}
