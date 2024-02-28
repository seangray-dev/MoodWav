import MoodWavLogoBlack from "@/assets/images/moodwav-high-resolution-logo-black-transparent.png";
import MoodWavLogoWhite from "@/assets/images/moodwav-high-resolution-logo-transparent.png";
import Image from "next/image";

export default function Header() {
  return (
    <header className="mb-10 flex w-full flex-col items-center gap-16">
      <div className="flex max-w-[300px] items-center justify-center gap-4 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
        <Image
          className="hidden h-[30px] w-[300px] dark:block"
          src={MoodWavLogoWhite}
          alt={"mood wav logo"}
          width={300}
          height={30}
        />
        <Image
          className="h-[30px] w-[300px] dark:hidden"
          src={MoodWavLogoBlack}
          alt={"mood wav logo"}
          width={300}
          height={30}
        />
      </div>
      <h1 className="sr-only">MoodWav</h1>
    </header>
  );
}
