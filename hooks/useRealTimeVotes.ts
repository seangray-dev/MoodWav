// hooks/useRealtimeVotes.ts
import { supabase } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

interface TrackPayload {
  new?: {
    spotify_track_id: string;
    vote_count: number;
  };
}

const useRealtimeVotes = () => {
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const subscription = supabase
      .channel('realtime:public:tracks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tracks' },
        (payload) => {
          console.log('Change received!', payload);
          const trackPayload = payload as unknown as TrackPayload;
          const spotifyTrackId = trackPayload.new?.spotify_track_id;
          const voteCount = trackPayload.new?.vote_count;

          if (
            typeof spotifyTrackId === 'string' &&
            typeof voteCount === 'number'
          ) {
            setVoteCounts((prev) => ({
              ...prev,
              [spotifyTrackId]: voteCount,
            }));
          } else {
            console.error(
              'Unexpected payload format or missing data:',
              payload
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return voteCounts;
};

export default useRealtimeVotes;
