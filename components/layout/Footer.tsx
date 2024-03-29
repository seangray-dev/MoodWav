import SpotifyLogo from "@/assets/images/Spotify_Logo_RGB_Green.png";
import MoodWavLogoWhite from "@/assets/images/moodwav-high-resolution-logo-transparent.png";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-10 border-t border-t-white py-10 text-xs md:flex-row md:justify-between md:gap-0 md:text-sm">
      <div className="flex flex-col-reverse items-center gap-4 md:items-start">
        <div className="flex w-full flex-col flex-wrap items-center gap-2 md:flex-row">
          <Link href={"/"} className="hover:underline">
            Home
          </Link>
          <Link href={"/mood"} className="hover:underline">
            Mood Calculator
          </Link>
          <Link href={"/my-best-of"} className="hover:underline">
            My Best Of
          </Link>
          <Link href={"/song-duels"} className="hover:underline">
            Song Duels
          </Link>
          <Link href={"/contact"} className="hover:underline">
            Contact
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Link href="/">
            <Image
              className="mx-auto h-[20px] w-[200px]"
              src={MoodWavLogoWhite}
              alt="moodwav logo"
              width={200}
              height={20}
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
      <div className="w-full justify-end space-y-10 md:w-auto">
        <div className="flex items-center justify-center gap-4 md:justify-end">
          <p>Powered by</p>
          <a target="_blank" href="https://spotify.com">
            <img
              className="w-[100px]"
              src={SpotifyLogo.src}
              alt="spotify logo"
            />
          </a>
        </div>
        <div className="flex w-full justify-between gap-2 md:justify-end">
          <Link href={"/legal/privacy"} className="hover:underline">
            Privacy Policy
          </Link>
          <Link href={"/legal/terms-of-use"} className="hover:underline">
            Terms Of Use
          </Link>
          <Link href={"/legal/cookies"} className="hover:underline">
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
