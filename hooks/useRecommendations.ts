import { fetchRecommendations } from "@/utils/spotify/spotify";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { data } from "../components/song-duels/data";

interface SpotifyTrack {
  preview_url: string | null;
}

interface SpotifyRecommendationsResponse {
  tracks: SpotifyTrack[];
}

const useMockData = false;

const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAndFilterRecommendations = async () => {
    setLoading(true);
    let fetchedData: SpotifyRecommendationsResponse;

    if (useMockData) {
      fetchedData = data as SpotifyRecommendationsResponse;
      // console.log(fetchedData);
    } else {
      try {
        const { data: session } = await supabase.auth.getSession();
        const accessToken = session?.session?.provider_token;

        if (accessToken) {
          fetchedData = await fetchRecommendations(accessToken);
        } else {
          console.error("No access token available.");
          fetchedData = { tracks: [] };
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        fetchedData = { tracks: [] };
      }
    }

    const filteredRecommendations = fetchedData.tracks.filter(
      (track) => track.preview_url,
    );

    // Append new recommendations to the existing list
    setRecommendations((prevRecommendations) => [
      ...prevRecommendations,
      ...filteredRecommendations,
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAndFilterRecommendations();
  }, []);

  return { recommendations, loading, fetchMore: fetchAndFilterRecommendations };
};

export default useRecommendations;
