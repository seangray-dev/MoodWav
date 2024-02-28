import { shuffle } from "lodash";
import { SpotifyUserProfile } from "./constants";

export const fetchSpotifyUserProfile = async (
  accessToken: string,
): Promise<SpotifyUserProfile | null> => {
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // Handle non-200 responses here
      console.error(
        `Error fetching Spotify user profile: ${response.statusText}`,
      );
      return null;
    }

    const userProfile: SpotifyUserProfile = await response.json();
    return userProfile;
  } catch (error) {
    console.error("Error fetching Spotify user profile:", error);
    return null;
  }
};

export const fetchAudioFeaturesForTracks = async (
  trackIds: string[],
  accessToken: string,
) => {
  const url = new URL("https://api.spotify.com/v1/audio-features");
  url.search = new URLSearchParams({ ids: trackIds.join(",") }).toString();

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching audio features: ${response.statusText}`);
    }

    const data = await response.json();
    return data.audio_features;
  } catch (error) {
    console.error("Error fetching audio features:", error);
    return null;
  }
};

export const fetchUsersTopArtists = async (
  accessToken: string,
  time_range = "medium_term",
) => {
  const url = `https://api.spotify.com/v1/me/top/artists?time_range=${time_range}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching top artists: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching top artists:", error);
    return null;
  }
};

export const fetchUsersTopTracks = async (
  accessToken: string,
  time_range = "medium_term",
) => {
  const url = `https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching top trackss: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return null;
  }
};

export const isUserFollowingArtist = async (
  accessToken: string,
  ids: string,
) => {
  const url = `https://api.spotify.com/v1/me/following/contains?type=artist&ids=${ids}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching top trackss: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return null;
  }
};

export const fetchRecommendations = async (accessToken: string) => {
  console.log("fetchRandom", accessToken);

  const topArtistsData = await fetchUsersTopArtists(accessToken, "medium_term");
  const topTracksData = await fetchUsersTopTracks(accessToken, "medium_term");

  // Shuffle and slice seed arrays
  const seedArtists = shuffle(topArtistsData.items)
    .slice(0, 2)
    .map((artist: { id: string }) => artist.id)
    .join(",");
  const seedTracks = shuffle(topTracksData.items)
    .slice(0, 3)
    .map((track: { id: string }) => track.id)
    .join(",");

  console.log("Seed Artists:", seedArtists);
  console.log("Seed Tracks:", seedTracks);

  const recommendationsUrl = `https://api.spotify.com/v1/recommendations?limit=100&seed_artists=${seedArtists}&seed_tracks=${seedTracks}`;
  const recommendationsResponse = await fetch(recommendationsUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!recommendationsResponse.ok) {
    throw new Error(
      `Error fetching recommendations: ${recommendationsResponse.statusText}`,
    );
  }

  const recommendationsData = await recommendationsResponse.json();
  console.log("Recommendations Data:", recommendationsData);
  return recommendationsData;
};

export const saveTrackForCurrentUser = async (
  accessToken: string,
  id: string,
) => {
  const url = "https://api.spotify.com/v1/me/tracks";

  try {
    const response = await fetch(url + "?ids=" + id, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to save track. Please try again.");
    }

    if (response.ok) {
      console.log("Tracks saved successfully");
    } else {
      console.error("Failed to save tracks", response.statusText);
    }
  } catch (error) {
    console.error("Error saving tracks:", error);
    throw new Error(
      "An error occurred while saving the track. Please try again later.",
    );
  }
};

export const removeTrackForCurrentUser = async (
  accessToken: string,
  id: string,
) => {
  const url = "https://api.spotify.com/v1/me/tracks";

  try {
    const response = await fetch(url + "?ids=" + id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to remove track. Please try again.");
    }

    if (response.ok) {
      console.log("Tracks removed successfully");
    } else {
      console.error("Failed to remove tracks", response.statusText);
    }
  } catch (error) {
    console.error("Error removing tracks:", error);
    throw new Error(
      "An error occurred while removing the track. Please try again later.",
    );
  }
};

export const checkIfTrackIsSaved = async (accessToken: string, id: string) => {
  const url = "https://api.spotify.com/v1/me/tracks/contains";

  try {
    const response = await fetch(url + "?ids=" + id, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const isSavedArray = await response.json(); // This should be an array of booleans
      return isSavedArray[0]; // Assuming you're only checking one track, return the first element
    } else {
      console.error("Failed to check if track is saved", response.statusText);
      return false; // In case of an error, you might want to return false or handle differently
    }
  } catch (error) {
    console.error("Error checking if track is saved:", error);
    return false; // Handle errors as needed
  }
};

export const fetchTrackById = async (accessToken: string, id: string) => {
  const url = `https://api.spotify.com/v1/me/tracks/${id}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch track", response.statusText);
    }
  } catch (error) {
    console.error("Failed to fetch track", error);
    throw new Error("Failed to fetch track");
  }
};
