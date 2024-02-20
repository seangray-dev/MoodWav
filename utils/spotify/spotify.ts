import { determineUserMood } from '../mood_calculations/calculations';

interface SpotifyExternalUrls {
  spotify: string;
}

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyArtist {
  external_urls: SpotifyExternalUrls;
  followers?: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  popularity: number;
  type: 'artist';
  uri: string;
}

interface SpotifyAlbum {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: {
    reason: string;
  };
  type: 'album';
  uri: string;
  artists: SpotifyArtist[];
}

interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
    ean?: string;
    upc?: string;
  };
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from?: object;
  known: any;
  restrictions?: {
    reason: string;
  };
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: 'track';
  uri: string;
  is_local: boolean;
}

interface SpotifyRecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string;
  context?: {
    type: string;
    href: string;
    external_urls: SpotifyExternalUrls;
    uri: string;
  };
}

interface SpotifyRecentlyPlayedResponse {
  href: string;
  limit: number;
  next: string | null;
  cursors: {
    after: string | null;
    before: string | null;
  };
  total: number;
  items: SpotifyRecentlyPlayedItem[];
}

export interface TrackDetail {
  id: string;
  name: string;
  artistName: string;
  coverArt: string;
  mood: string;
}

export interface SpotifyUserProfile {
  display_name: string;
  images: SpotifyImage[];
}

export const fetchSpotifyUserProfile = async (
  accessToken: string
): Promise<SpotifyUserProfile | null> => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // Handle non-200 responses here
      console.error(
        `Error fetching Spotify user profile: ${response.statusText}`
      );
      return null;
    }

    const userProfile: SpotifyUserProfile = await response.json();
    return userProfile;
  } catch (error) {
    console.error('Error fetching Spotify user profile:', error);
    return null;
  }
};

export const fetchRecentlyPlayedTracks = async (
  accessToken: string
): Promise<TrackDetail[] | null> => {
  const url = 'https://api.spotify.com/v1/me/player/recently-played?limit=50';

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error(
        'Error fetching recently played tracks:',
        response.statusText
      );
      return null;
    }

    const { items }: SpotifyRecentlyPlayedResponse = await response.json();
    const trackIds = items.map((item) => item.track.id);
    const audioFeatures = await fetchAudioFeaturesForTracks(
      trackIds,
      accessToken
    );

    if (!audioFeatures) {
      throw new Error('Failed to fetch audio features for tracks');
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
        artistName: item.track.artists.map((artist) => artist.name).join(', '),
        coverArt: item.track.album.images[0]?.url ?? '',
        mood: topMood,
      };
    });

    return tracksWithMoods;
  } catch (error) {
    console.error('Error fetching recently played tracks:', error);
    return null;
  }
};

export const fetchAudioFeaturesForTracks = async (
  trackIds: string[],
  accessToken: string
) => {
  const url = new URL('https://api.spotify.com/v1/audio-features');
  url.search = new URLSearchParams({ ids: trackIds.join(',') }).toString();

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
    console.error('Error fetching audio features:', error);
    return null;
  }
};

export const fetchUsersTopArtists = async (
  accessToken: string,
  time_range: string
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
    console.error('Error fetching top artists:', error);
    return null;
  }
};

export const fetchUsersTopTracks = async (
  accessToken: string,
  time_range: string
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
    console.error('Error fetching top tracks:', error);
    return null;
  }
};

export const isUserFollowingArtist = async (
  accessToken: string,
  ids: string
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
    console.error('Error fetching top tracks:', error);
    return null;
  }
};

export const fetchRandomRecommendationPair = async (accessToken: string) => {
  // Fetch users top artists and tracks
  const topArtistsData = await fetchUsersTopArtists(accessToken, 'medium_term');
  const topTracksData = await fetchUsersTopTracks(accessToken, 'medium_term');

  // Extract seed IDs (using up to 5 seeds in total)
  const seedArtists = topArtistsData.items
    .slice(0, 2)
    .map((artist) => artist.id)
    .join(',');
  const seedTracks = topTracksData.items
    .slice(0, 3)
    .map((track) => track.id)
    .join(',');

  // Fetch recommendations based on seed artists and tracks
  const recommendationsUrl = `https://api.spotify.com/v1/recommendations?limit=10&seed_artists=${seedArtists}&seed_tracks=${seedTracks}`;
  const recommendationsResponse = await fetch(recommendationsUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!recommendationsResponse.ok) {
    throw new Error(
      `Error fetching recommendations: ${recommendationsResponse.statusText}`
    );
  }

  const recommendationsData = await recommendationsResponse.json();

  // Filter tracks to include only those with a preview_url
  const tracksWithPreview = recommendationsData.tracks.filter(
    (track) => track.preview_url
  );

  // Ensure there are at least 2 tracks with preview URLs
  if (tracksWithPreview.length < 2) {
    throw new Error('Not enough tracks with preview URLs for selection');
  }

  //Randomly select two tracks from the filtered recommendations
  const randomIndices = [];
  while (randomIndices.length < 2) {
    const randomIndex = Math.floor(Math.random() * tracksWithPreview.length);
    if (!randomIndices.includes(randomIndex)) {
      randomIndices.push(randomIndex);
    }
  }

  return [
    tracksWithPreview[randomIndices[0]],
    tracksWithPreview[randomIndices[1]],
  ];
};
