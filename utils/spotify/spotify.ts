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

export const fetchSpotifyUserID = async (
  accessToken: string
): Promise<string | null> => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // Handle non-200 responses here
      console.error(`Error fetching Spotify profile: ${response.statusText}`);
      return null;
    }

    const spotifyProfile = await response.json();

    return spotifyProfile.id;
  } catch (error) {
    console.error('Error fetching Spotify user ID:', error);
    return null;
  }
};

export const fetchRecentlyPlayedTracks = async (accessToken: string) => {
  const url = 'https://api.spotify.com/v1/me/player/recently-played?limit=50';

  https: try {
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recently played tracks:', error);
    return null;
  }
};

export const getRecentlyPlayedTrackIds = async (
  accessToken: string
): Promise<string[] | null> => {
  const recentlyPlayedResponse = await fetchRecentlyPlayedTracks(accessToken);
  if (recentlyPlayedResponse && recentlyPlayedResponse.items) {
    return recentlyPlayedResponse.items.map(
      (item: SpotifyRecentlyPlayedItem) => item.track.id
    );
  }
  return null;
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
