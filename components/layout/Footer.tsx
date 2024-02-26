import SpotifyLogo from "@/assets/images/Spotify_Logo_RGB_Green.png";
import MoodWavLogoBlack from "@/assets/images/moodwav-high-resolution-logo-black-transparent.png";
import MoodWavLogoWhite from "@/assets/images/moodwav-high-resolution-logo-transparent.png";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-10 border-t border-t-card-foreground py-8 text-xs text-muted-foreground md:flex-row md:justify-between">
      <div className="flex flex-col-reverse items-center gap-4 text-card-foreground">
        <div className="flex w-full flex-col flex-wrap items-center justify-end gap-2 md:flex-row">
          <Link
            href={"/"}
            className="duration-300 hover:text-primary hover:underline"
          >
            Home
          </Link>
          <Link
            href={"/mood"}
            className="duration-300 hover:text-primary hover:underline"
          >
            Mood Calculator
          </Link>
          <Link
            href={"/my-best-of"}
            className="duration-300 hover:text-primary hover:underline"
          >
            My Best Of
          </Link>
          <Link
            href={"/song-duels"}
            className="duration-300 hover:text-primary hover:underline"
          >
            Song Duels
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Link href="/">
            <Image
              className="mx-auto hidden dark:block"
              src={MoodWavLogoWhite}
              alt="moodwav logo"
              width={200}
              height={200}
            />
            <Image
              className="mx-auto dark:hidden"
              src={MoodWavLogoBlack}
              alt="moodwav logo"
              width={200}
              height={200}
            />
          </Link>
          <p>
            Built by{" "}
            <a
              href="https://www.seangray.tech"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Sean Gray
            </a>
          </p>
        </div>
      </div>
      <div className="justify-end space-y-10">
        <div className="flex items-center justify-center gap-4 text-card-foreground md:justify-end">
          <p>Powered by</p>
          <a target="_blank" href="https://spotify.com">
            <img
              className="w-[100px]"
              src={SpotifyLogo.src}
              alt="spotify logo"
            />
          </a>
        </div>
        <div className="flex w-full justify-end gap-2">
          <Link
            href={"/contact"}
            className="duration-300 hover:text-primary hover:underline"
          >
            Contact
          </Link>
          <Link
            href={"/legal/privacy"}
            className="duration-300 hover:text-primary hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href={"/legal/terms-of-use"}
            className="duration-300 hover:text-primary hover:underline"
          >
            Terms Of Use
          </Link>
          <Link
            href={"/legal/cookies"}
            className="duration-300 hover:text-primary hover:underline"
          >
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
