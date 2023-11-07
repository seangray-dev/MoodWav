type SpotifyAudioFeatures = {
  valence: number;
  energy: number;
  mode: number;
  danceability: number;
  acousticness: number;
  loudness: number;
  tempo: number;
  speechiness: number;
  instrumentalness: number;
  liveness: number;
};

const MIN_LOUDNESS = -60;
const MAX_LOUDNESS = 0;
const MIN_TEMPO = 50; // Min tempo usually around 50 BPM for slow songs
const MAX_TEMPO = 200; // Max tempo around 200 BPM for very fast songs

// Normalization functions
const normalize = (value: number, min: number, max: number): number =>
  (value - min) / (max - min);

const calculateJoyfulScore = (features: SpotifyAudioFeatures): number => {
  return (
    0.3 * features.valence +
    0.2 * features.energy +
    0.2 * (features.mode === 1 ? 1 : 0) + // Major mode
    0.15 * features.danceability +
    0.05 * (1 - features.acousticness) + // Less acousticness contributes to joyful
    0.05 * (1 - features.instrumentalness) + // Less instrumentalness contributes to joyful
    0.05 * normalize(features.tempo, MIN_TEMPO, MAX_TEMPO)
  );
};

const calculateRelaxedScore = (features: SpotifyAudioFeatures): number => {
  return (
    0.3 * features.acousticness +
    0.25 * (1 - features.energy) +
    0.15 * (1 - normalize(features.loudness, MIN_LOUDNESS, MAX_LOUDNESS)) +
    0.15 * (1 - normalize(features.tempo, MIN_TEMPO, MAX_TEMPO)) +
    0.1 * features.valence +
    0.05 * (features.mode === 1 ? 1 : 0) // Major mode
  );
};

const calculateSadScore = (features: SpotifyAudioFeatures): number => {
  return (
    0.25 * (1 - features.valence) +
    0.2 * (features.mode === 0 ? 1 : 0) + // Minor mode
    0.15 * features.acousticness +
    0.15 * (1 - features.energy) +
    0.1 * (1 - normalize(features.tempo, MIN_TEMPO, MAX_TEMPO)) +
    0.05 * (1 - features.danceability) +
    0.05 * (1 - normalize(features.loudness, MIN_LOUDNESS, MAX_LOUDNESS)) +
    0.05 * features.instrumentalness
  );
};

const calculateEnergeticScore = (features: SpotifyAudioFeatures): number => {
  return (
    0.25 * features.energy +
    0.2 * normalize(features.tempo, MIN_TEMPO, MAX_TEMPO) +
    0.15 * normalize(features.loudness, MIN_LOUDNESS, MAX_LOUDNESS) +
    0.15 * features.danceability +
    0.1 * features.valence +
    0.05 * (features.mode === 1 ? 1 : 0) + // Major mode
    0.05 * features.speechiness +
    0.05 * features.liveness
  );
};

const calculateAngryScore = (features: SpotifyAudioFeatures): number => {
  return (
    0.25 * features.energy +
    0.2 * normalize(features.loudness, MIN_LOUDNESS, MAX_LOUDNESS) +
    0.15 * (1 - features.valence) +
    0.15 * normalize(features.tempo, MIN_TEMPO, MAX_TEMPO) +
    0.1 * features.speechiness +
    0.05 * (features.mode === 0 ? 1 : 0) + // Minor mode
    0.05 * (1 - features.acousticness) +
    0.05 * features.danceability +
    0.05 * features.liveness
  );
};

const calculateReflectiveScore = (features: SpotifyAudioFeatures): number => {
  return (
    0.3 * features.instrumentalness +
    0.2 * features.acousticness +
    0.15 * (1 - features.liveness) +
    0.15 * (1 - features.energy) +
    0.1 * (1 - normalize(features.loudness, MIN_LOUDNESS, MAX_LOUDNESS)) +
    0.05 * (1 - features.speechiness) +
    0.05 * (1 - features.danceability) +
    0.05 * normalize(features.tempo, MIN_TEMPO, MAX_TEMPO)
  );
};

// Function to determine the user's mood
export const determineUserMood = (
  audioFeatures: SpotifyAudioFeatures[]
): {
  highestMood: string;
  highestScore: number;
  allMoods: Record<string, number>;
} => {
  const moodScores = audioFeatures.reduce(
    (scores, features) => {
      scores.joyful += calculateJoyfulScore(features);
      scores.relaxed += calculateRelaxedScore(features);
      scores.sad += calculateSadScore(features);
      scores.energetic += calculateEnergeticScore(features);
      scores.angry += calculateAngryScore(features);
      scores.reflective += calculateReflectiveScore(features);
      return scores;
    },
    {
      joyful: 0,
      relaxed: 0,
      sad: 0,
      energetic: 0,
      angry: 0,
      reflective: 0,
    }
  );

  // Calculate the total score for normalization
  const totalScore = Object.values(moodScores).reduce(
    (total, score) => total + score,
    0
  );

  // Normalize scores so that they sum up to 100%
  const moodPercentages = Object.fromEntries(
    Object.entries(moodScores).map(([mood, score]) => [
      mood,
      (score / totalScore) * 100,
    ])
  );

  // Find the highest mood score
  const highestMoodEntry = Object.entries(moodPercentages).reduce(
    (highest, current) => {
      return current[1] > highest[1] ? current : highest;
    }
  );

  // Return the highest mood, its score, and all mood percentages
  return {
    highestMood: highestMoodEntry[0],
    highestScore: highestMoodEntry[1],
    allMoods: moodPercentages,
  };
};
