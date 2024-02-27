import Header from "@/components/home/Header";
import SpotifyMoodPrompt from "@/components/home/SpotifyMoodPrompt";

export default function Index() {
  return (
    <div className="font- flex h-full w-full flex-col place-content-center items-center justify-center">
      <Header />
      <SpotifyMoodPrompt />
    </div>
  );
}
