import SpotifyLogo from "@/assets/images/Spotify_Logo_RGB_Green.png";
import MoodWavLogo from "@/assets/images/moodwav-high-resolution-logo-transparent.png";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-10 border-t border-t-foreground/10 py-8 text-xs md:container md:flex-row md:justify-between">
      <div className="flex flex-col-reverse items-center gap-4">
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
        <Link href="/">
          <Image
            className="mx-auto"
            src={MoodWavLogo}
            alt="moodwav logo"
            width={200}
            height={200}
          />
        </Link>
      </div>
      <div className="flex items-center justify-center gap-4">
        <p>Powered by</p>
        <a target="_blank" href="https://spotify.com">
          <img className="w-[100px]" src={SpotifyLogo.src} alt="spotify logo" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
