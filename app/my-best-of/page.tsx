import TopArtists from "@/components/my-best-of/TopArtists";
import TopTracks from "@/components/my-best-of/TopTracks";
import AlertMessage from "@/components/ui/AlertMessage";
import readUserSession from "@/server/read-user-session";
import {
  fetchUsersTopArtists,
  fetchUsersTopTracks,
} from "@/utils/spotify/spotify";
import { fetchAccessToken } from "@/utils/supabase/fecthAccessToken";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export default async function BestOfPage() {
  // check to see if user is logged in
  const { data } = await readUserSession();
  if (!data.session) {
    return (
      <AlertMessage message="You must be logged in to use this feature." />
    );
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["top-artists", "top-tracks"],
    queryFn: async () => {
      const accessToken = await fetchAccessToken();
      return [
        fetchUsersTopArtists(accessToken),
        fetchUsersTopTracks(accessToken),
      ];
    },
  });

  return (
    <div className="w-full py-10">
      <h1 className="mb-10 text-2xl font-bold text-card-foreground md:text-4xl 2xl:text-6xl">
        My Best Of Spotify
      </h1>
      <div className="flex flex-col gap-20">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <TopArtists />
          <TopTracks />
        </HydrationBoundary>
      </div>
    </div>
  );
}
