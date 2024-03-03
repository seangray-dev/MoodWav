import LeaderBoardTable from "@/components/song-duels/leaderboard/LeaderBoardTable";
import Stats from "@/components/song-duels/Stats";
import { fetchTop10VotedSongs } from "@/utils/supabase/db";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function LeaderBoardPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["top-voted-tracks"],
    queryFn: async () => {
      return [fetchTop10VotedSongs()];
    },
  });

  return (
    <section className="w-full flex-1 pb-10">
      <Stats />
      <div className="prose prose-invert pt-10">
        <h1>Leaderboard</h1>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <LeaderBoardTable />
      </HydrationBoundary>
    </section>
  );
}
