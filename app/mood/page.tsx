'use client';

import { determineUserMood } from '@/utils/mood_calculations/calculations';
import {
  fetchAudioFeaturesForTracks,
  fetchSpotifyUserID,
  getRecentlyPlayedTrackIds,
} from '@/utils/spotify/spotify';
import { useEffect, useState } from 'react';

const Mood = () => {
  const [spotifyUserID, setSpotifyUserID] = useState<string | undefined>(
    undefined
  );
  const [moodData, setMoodData] = useState<{
    highestMood: string;
    allMoods: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const accessToken = sessionStorage.getItem('spotifyAccessToken');

      if (accessToken) {
        const recentlyPlayedTrackIDs = await getRecentlyPlayedTrackIds(
          accessToken
        );
        const audioFeatures = await fetchAudioFeaturesForTracks(
          recentlyPlayedTrackIDs,
          accessToken
        );
        if (audioFeatures) {
          const mood = determineUserMood(audioFeatures);
          setMoodData(mood);
        }
      } else {
        console.error('Access token not found in session storage.');
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div>
      <h1>Mood</h1>
      {moodData ? (
        <div>
          <p>Highest Mood: {moodData.highestMood}</p>
          <h2>All Moods</h2>
          <ul>
            {Object.entries(moodData.allMoods).map(([mood, score]) => (
              <li key={mood}>{`${mood}: ${score.toFixed(2)}`}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading mood data...</p>
      )}
    </div>
  );
};

export default Mood;
