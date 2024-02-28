import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const useRealTimeAddedToLibraryCount = () => {
  const [totalAdeedToLibraryCount, setTotalAddedToLibraryCount] = useState(0);

  async function fetchAddedToLibraryCount() {
    // console.log("Fetching total votes:");
    try {
      const { data, error } = await supabase.rpc("sum_added_to_library_count");
      if (error) throw error;
      // console.log("settingTotalVotes with data:", data);
      setTotalAddedToLibraryCount(data);
      return data;
    } catch (error) {
      console.error("Error fetching total vote count:", error);
    }
  }

  useEffect(() => {
    fetchAddedToLibraryCount();
    const subscription = supabase
      .channel("addedToLibraryCount")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tracks" },
        (payload) => {
          fetchAddedToLibraryCount();
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

  return { totalAdeedToLibraryCount };
};

export default useRealTimeAddedToLibraryCount;
