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
  const recentlyPlayed = await fetchRecentlyPlayedTracks(accessToken);
  if (recentlyPlayed && recentlyPlayed.items) {
    return recentlyPlayed.items.map((item) => item.track.id);
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
