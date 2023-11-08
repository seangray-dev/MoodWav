'use client';

import SpotifyLogo from '@/assets/images/Spotify_Icon_RGB_Green.png';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { determineUserMood } from '@/utils/mood_calculations/calculations';
import {
  TrackDetail,
  fetchAudioFeaturesForTracks,
  fetchRecentlyPlayedTracks,
  fetchSpotifyUserID,
} from '@/utils/spotify/spotify';
import { ShareIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import ErrorAlert from './Error';
import LoadingData from './LoadingData';
import NoMoodData from './NoMoodData';

const Mood = () => {
  const [spotifyUserID, setSpotifyUserID] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [moodData, setMoodData] = useState<{
    highestMood: string;
    highestScore: number;
    allMoods: Record<string, number>;
  } | null>(null);
  const [recentTracks, setRecentTracks] = useState<TrackDetail[]>([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const accessToken = sessionStorage.getItem('spotifyAccessToken');
        if (!accessToken) throw new Error('Access token not found.');

        const tracksDetails = await fetchRecentlyPlayedTracks(accessToken);
        console.log(accessToken);
        if (!tracksDetails || tracksDetails.length === 0)
          throw new Error('No recently played tracks found.');

        setRecentTracks(tracksDetails);

        const trackIds = tracksDetails.map((track) => track.id);
        const audioFeatures = await fetchAudioFeaturesForTracks(
          trackIds,
          accessToken
        );
        if (!audioFeatures || audioFeatures.length === 0)
          throw new Error('Could not fetch audio features for tracks.');

        const mood = determineUserMood(audioFeatures);
        setMoodData(mood);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const moodBG = {
    joyful: 'bg-yellow-200',
    relaxed: 'bg-green-300',
    sad: 'bg-blue-300',
    angry: 'bg-red-300',
    energetic: 'bg-orange-300',
    reflective: 'bg-indigo-300',
  };

  const moodTextColor = {
    joyful: 'text-yellow-900',
    relaxed: 'text-green-900',
    sad: 'text-blue-900',
    angry: 'text-red-900',
    energetic: 'text-orange-900',
    reflective: 'text-indigo-900',
  };

  const moodGradient = {
    joyful: 'bg-gradient-to-b from-yellow-400 to-yellow-300',
    relaxed: 'bg-gradient-to-b from-green-400 to-green-300',
    sad: 'bg-gradient-to-b from-blue-400 to-blue-300',
    angry: 'bg-gradient-to-b from-red-500 to-red-300',
    energetic: 'bg-gradient-to-b from-orange-400 to-orange-300',
    reflective: 'bg-gradient-to-b from-indigo-400 to-indigo-300',
  };

  const moodGradientReverse = {
    joyful: 'bg-gradient-to-t from-yellow-400 to-yellow-300',
    relaxed: 'bg-gradient-to-t from-green-400 to-green-300',
    sad: 'bg-gradient-to-t from-blue-400 to-blue-300',
    angry: 'bg-gradient-to-t from-red-500 to-red-300',
    energetic: 'bg-gradient-to-t from-orange-400 to-orange-300',
    reflective: 'bg-gradient-to-t from-indigo-400 to-indigo-300',
  };

  if (loading) {
    return <LoadingData />;
  }

  if (error) {
    return <ErrorAlert />;
  }

  if (!moodData) {
    return <NoMoodData />;
  }

  return (
    <div className='flex flex-1 flex-col place-content-center moodring w-full'>
      <div className='container mt-20'>
        <Card className='flex-1 border-none mx-auto flex flex-col gap-6 md:grid md:grid-cols-2 rounded-[32px] bg-primary'>
          <Card
            className={`md:flex md:flex-col md:place-content-center md:gap-0 md:justify-evenly border-none rounded-[32px] flex flex-col gap-4 pb-10 py-6 ${
              moodGradient[
                moodData.highestMood.toLowerCase() as keyof typeof moodGradient
              ]
            } `}>
            <p className='text-center font-medium text-lg text-muted md:text-2xl'>
              Your Mood
            </p>
            <div className='flex justify-center'>
              <div
                className={`flex flex-col justify-center items-center rounded-full w-[140px] h-[140px] md:w-[200px] md:h-[200px] ${
                  moodGradientReverse[
                    moodData.highestMood.toLowerCase() as keyof typeof moodGradient
                  ]
                } `}>
                <span className='text-[56px] md:text-[72px] text-white font-bold'>
                  {moodData.highestScore.toFixed(1)}
                </span>
              </div>
            </div>
            <p className='text-center text-white text-2xl font-bold md:text-[32px]'>
              {moodData.highestMood.toLocaleUpperCase()}
            </p>
          </Card>
          <div className='px-8 flex flex-col gap-4 pb-8 md:pb-[46px] md:gap-[28px]'>
            <h2 className='text-white font-medium md:text-2xl md:mt-[38px]'>
              Summary
            </h2>
            <ul className='flex flex-col gap-4'>
              {Object.entries(moodData.allMoods).map(([mood, score]) => (
                <li
                  className={`flex justify-between text-sm px-4 py-[18px] rounded-lg ${
                    moodBG[mood as keyof typeof moodBG]
                  } ${moodTextColor[mood as keyof typeof moodTextColor]}`}
                  key={mood}>
                  <span className='font-medium'>
                    {mood.toLocaleUpperCase()}
                  </span>
                  <span className='font-bold'>{score.toFixed(1)}%</span>
                </li>
              ))}
            </ul>
            <Button className='rounded-[288px] py-8 text-[18px] flex gap-3 items-center bg-primary-foreground text-card-foreground hover:text-white hover:bg-transparent border border-white transition-all duration-300'>
              <span>Share</span>
              <ShareIcon size={18} />
            </Button>
          </div>
        </Card>

        <div className='mt-20 mb-10 flex flex-col'>
          <h2 className='text-lg md:text-2xl mb-6 font-medium'>
            Recent Played
          </h2>
          <ul className='flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3'>
            {recentTracks.map((track) => (
              <li
                className='hover:scale-[105%] transition-all duration-300 w-full'
                key={track.id}>
                <Card className='w-full flex items-center gap-6 bg-primary text-primary-foreground border-none'>
                  <img
                    className='w-1/4'
                    src={track.coverArt ? track.coverArt : SpotifyLogo.src}
                    alt={track.name}
                  />
                  <div className='flex flex-col gap-2 overflow-hidden'>
                    <p className='font-bold truncate'>{track.name}</p>
                    <p className='text-muted-foreground truncate'>
                      {track.artistName}
                    </p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Mood;
