import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const useRealtimeVotes = () => {
  const [totalVotes, setTotalVotes] = useState(0);

  async function fetchTotalVotes() {
    // console.log("Fetching total votes:");
    try {
      const { data, error } = await supabase.rpc("sum_vote_counts");
      if (error) throw error;
      // console.log("settingTotalVotes with data:", data);
      setTotalVotes(data);
      return data;
    } catch (error) {
      console.error("Error fetching total vote count:", error);
    }
  }

  useEffect(() => {
    fetchTotalVotes();
    const subscription = supabase
      .channel("totalVotes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tracks" },
        (payload) => {
          fetchTotalVotes();
          {
            console.error(
              "Unexpected payload format or missing data:",
              payload,
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return { totalVotes };
};

export default useRealtimeVotes;
