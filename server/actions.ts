"use server";

import { determineUserMood } from "@/utils/mood_calculations/calculations";
import { SpotifyRecentlyPlayedResponse } from "@/utils/spotify/constants";
import { fetchAudioFeaturesForTracks } from "@/utils/spotify/spotify";
import { RecentlyPlayedTracks } from "@/utils/spotify/types";

export const fetchRecentlyPlayedTracks = async (accessToken: string) => {
  const url = "https://api.spotify.com/v1/me/player/recently-played?limit=50";

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error(
        "Error fetching recently played tracks:",
        response.statusText,
      );
      return null;
    }

    const { items }: RecentlyPlayedTracks = await response.json();
    const trackIds = items.map((item) => item.track.id);
    const audioFeatures = await fetchAudioFeaturesForTracks(
      trackIds,
      accessToken,
    );

    if (!audioFeatures) {
      throw new Error("Failed to fetch audio features for tracks");
    }

    // Calculate the mood for each track
    const tracksWithMoods = items.map((item, index) => {
      const moodData = determineUserMood([audioFeatures[index]]);
      const allMoods = moodData.allMoods;

      // Sort the moods by their scores and select the top 1
      const topMood = Object.entries(allMoods)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 1)
        .map(([key]) => key)[0];

      return {
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists,
        coverArt: item.track.album.images[0]?.url ?? "",
        mood: topMood,
      };
    });

    return tracksWithMoods;
  } catch (error) {
    console.error("Error fetching recently played tracks:", error);
    return null;
  }
};

export const fetchUserMoodData = async (accessToken: string) => {
  const url = "https://api.spotify.com/v1/me/player/recently-played?limit=50";

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching recently played tracks: ${response.statusText}`,
      );
    }

    const { items }: SpotifyRecentlyPlayedResponse = await response.json();
    const trackIds = items.map((item) => item.track.id);
    const audioFeatures = await fetchAudioFeaturesForTracks(
      trackIds,
      accessToken,
    );

    if (!audioFeatures) {
      throw new Error("Failed to fetch audio features for tracks");
    }

    // Calculate the user's mood based on the audio features
    const moodData = determineUserMood(audioFeatures);

    // Returns the highestMood, highestScore, and allMoods
    return moodData;
  } catch (error) {
    console.error("Error in fetchUserMoodData:", error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};
