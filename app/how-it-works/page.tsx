'use client';

import Footer from '@/components/layout/Footer';
import Nav from '@/components/layout/Nav';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const moods = [
  {
    title: 'Blissful',
    features: [
      { name: 'Valence (Joyfulness)', weight: '30%' },
      { name: 'Energy', weight: '20%' },
      { name: 'Major Key', weight: '20%' },
      { name: 'Danceability', weight: '15%' },
      { name: 'Acousticness (Less Acoustic)', weight: '5%' },
      { name: 'Instrumentalness (Less Instrumental)', weight: '5%' },
      { name: 'Tempo', weight: '5%' },
    ],
  },
  {
    title: 'Serenity',
    features: [
      { name: 'Acousticness', weight: '30%' },
      { name: 'Energy (Lower Energy)', weight: '25%' },
      { name: 'Loudness (Quieter Sound)', weight: '15%' },
      { name: 'Tempo (Slower Tempo)', weight: '15%' },
      { name: 'Valence', weight: '10%' },
      { name: 'Mode (Major Key)', weight: '5%' },
    ],
  },
  {
    title: 'Melancholic',
    features: [
      { name: 'Valence (Lower Valence)', weight: '25%' },
      { name: 'Mode (Minor Key)', weight: '20%' },
      { name: 'Acousticness', weight: '15%' },
      { name: 'Energy (Lower Energy)', weight: '15%' },
      { name: 'Tempo (Slower Tempo)', weight: '10%' },
      { name: 'Danceability (Less Danceable)', weight: '5%' },
      { name: 'Loudness (Quieter Sound)', weight: '5%' },
      { name: 'Instrumentalness', weight: '5%' },
    ],
  },
  {
    title: 'Vibrant',
    features: [
      { name: 'Energy', weight: '25%' },
      { name: 'Tempo', weight: '20%' },
      { name: 'Loudness', weight: '15%' },
      { name: 'Danceability', weight: '15%' },
      { name: 'Valence', weight: '10%' },
      { name: 'Mode (Major Key)', weight: '5%' },
      { name: 'Speechiness', weight: '5%' },
      { name: 'Liveness', weight: '5%' },
    ],
  },
  {
    title: 'Nostalgic',
    features: [
      { name: 'Acousticness', weight: '30%' },
      { name: 'Energy (Lower Energy)', weight: '25%' },
      { name: 'Tempo (Slower Tempo)', weight: '20%' },
      { name: 'Danceability (Less Danceable)', weight: '10%' },
      { name: 'Valence', weight: '10%' },
      { name: 'Speechiness (Less Speechiness)', weight: '5%' },
    ],
  },
  {
    title: 'Reflective',
    features: [
      { name: 'Instrumentalness', weight: '30%' },
      { name: 'Acousticness', weight: '25%' },
      { name: 'Valence (Lower Valence)', weight: '20%' },
      { name: 'Tempo (Slower Tempo)', weight: '10%' },
      { name: 'Energy (Lower Energy)', weight: '10%' },
      { name: 'Speechiness (Less Speechiness)', weight: '5%' },
    ],
  },
];

interface MoodCardProps {
  title: string;
  features: { name: string; weight: string }[];
}

const MoodCard = ({ title, features }: MoodCardProps) => (
  <Card className='bg-secondary-foreground flex-grow'>
    <CardHeader>
      <CardTitle className='text-white'>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className='text-white text-sm'>
        {features.map((feature, index) => (
          <li className='text-xs sm:text-sm md:text-base' key={index}>
            <div className='flex'>
              <span className='font-bold'>{feature.name}</span>
              <span className='text-right flex-grow'>{feature.weight}</span>
            </div>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const HowItWorks = () => {
  return (
    <div className='my-10'>
      <h1 className='text-3xl sm:text-4xl font-bold mb-6'>How It Works</h1>
      <Separator />
      <section className='my-8' aria-labelledby='disclaimer-section'>
        <h2 id='disclaimer-section' className='text-xl sm:text-2xl font-bold'>
          Disclaimer
        </h2>
        <p>
          While we strive for accuracy, music perception is subjective, and our
          mood categorizations might not always align with every individual's
          interpretation. Our system is designed to offer a general guide to the
          mood of tracks based on their audio features.
        </p>
      </section>
      <Separator />

      <section className='my-8' aria-labelledby='audio-features-section'>
        <h2
          id='audio-features-section'
          className='text-xl sm:text-2xl font-bold'>
          The Audio Features
        </h2>
        <p className='mb-6'>
          Each track's mood is determined based on several key audio features
          provided by Spotify:
        </p>
        <ul
          className='text-left flex flex-col gap-2 md:grid md:grid-cols-2 drop-shadow-2xl'
          aria-label='List of Audio Features'>
          <li>
            <p>
              <span className='font-bold'>Valence:</span> Measures the musical
              positiveness.
            </p>
          </li>
          <li>
            <p>
              <span className='font-bold'>Energy:</span> Indicates the intensity
              and activity level.
            </p>
          </li>
          <li>
            <p>
              <span className='font-bold'>Mode:</span> Determines if the track
              is in a major (happy) or minor (sad) key.
            </p>
          </li>
          <li>
            <p>
              <span className='font-bold'>Danceability:</span> Assesses how
              suitable a track is for dancing.
            </p>
          </li>
          <li>
            <p>
              <span className='font-bold'>Acousticness:</span> Reflects the
              confidence level of the track being acoustic.
            </p>
          </li>
          <li>
            <p>
              <span className='font-bold'>Loudness:</span> The overall loudness
              of a track in decibels (dB).
            </p>
          </li>
          <li>
            <p>
              <span className='font-bold'>Tempo:</span> The overall estimated
              tempo of a track in beats per minute (BPM).
            </p>
          </li>
          <li>
            <p>
              <span className='font-bold'>Speechiness:</span> Detects the
              presence of spoken words.
            </p>
          </li>
          <li>
            <p>
              <span className='font-bold'>Instrumentalness:</span> Predicts
              whether a track contains no vocals.
            </p>
          </li>
          <li>
            <p>
              <span className='font-bold'>Liveness:</span> Detects the presence
              of an audience in the recording.
            </p>
          </li>
        </ul>
      </section>
      <Separator />

      <section
        className='my-8'
        aria-labelledby='user-mood-determination-section'>
        <h2
          id='user-mood-determination-section'
          className='text-xl sm:text-2xl font-bold'>
          Determining Your Mood
        </h2>
        <p className='mb-6'>
          The mood that best matches your current state is determined by
          analyzing your recently played tracks on Spotify.
        </p>
        <p className='font-medium mb-2'>Here's how it works:</p>
        <p className='flex flex-col gap-1'>
          <span>
            - We calculate scores for each mood based on the audio features of
            your recently played tracks.
          </span>
          <span>
            - These scores are then normalized to identify the most prominent
            mood.
          </span>
          <span>
            - The mood with the highest score is considered your current mood.
          </span>
        </p>
      </section>
      <Separator />
      <section className='my-8' aria-labelledby='mood-calculation-section'>
        <h2
          id='mood-calculation-section'
          className='text-xl sm:text-2xl font-bold'>
          Mood Calculation Explained
        </h2>
        <p className='mb-6'>
          Here's how we calculate different moods for each track, and the
          weighting for each audio feature:
        </p>
        <ul
          className='text-left flex flex-col gap-2 md:grid md:grid-cols-2'
          aria-label='List of Mood Calculations'>
          {moods.map((mood, index) => (
            <li key={index} className='md:col-span-1 flex flex-col flex-grow'>
              <MoodCard title={mood.title} features={mood.features} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default HowItWorks;
