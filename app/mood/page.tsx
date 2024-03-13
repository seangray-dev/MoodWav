import MoodWavLogoWhite from "@/assets/images/moodwav-high-resolution-logo-transparent.png";
import AlertMessage from "@/components/ui/AlertMessage";
import { fetchRecentlyPlayedTracks, fetchUserMoodData } from "@/server/actions";
import readUserSession from "@/server/read-user-session";
import { fetchAccessToken } from "@/utils/supabase/fecthAccessToken";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import MoodScoreCard from "../../components/mood/MoodScoreCard";
import RecentlyPlayed from "../../components/mood/RecentlyPlayed";

export default async function MoodPage() {
  const { data } = await readUserSession();
  if (!data.session) {
    return (
      <AlertMessage message="You must be logged in to use this feature." />
    );
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["recently-played", "mood-data"],
    queryFn: async () => {
      const accessToken = await fetchAccessToken();
      return [
        fetchRecentlyPlayedTracks(accessToken),
        fetchUserMoodData(accessToken),
      ];
    },
  });

  return (
    <div className="flex w-full flex-1 flex-col place-content-center">
      <Link className="mt-4 w-fit underline" href={"/mood/how-it-works"}>
        How it works
      </Link>
      <div className="mt-20 px-2">
        <Image
          className="mx-auto mb-10 h-[30px] w-[300px]"
          src={MoodWavLogoWhite}
          alt="moodwav logo"
          width={300}
          height={30}
        />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <MoodScoreCard />
          <RecentlyPlayed />
        </HydrationBoundary>
      </div>
    </div>
  );
}
