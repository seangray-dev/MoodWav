'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchUsersTopTracks } from '@/utils/spotify/spotify';
import { fetchAccessToken } from '@/utils/supabase/fecthAccessToken';
import { useQuery } from '@tanstack/react-query';
import { ExternalLinkIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { TopTracksSkeleton } from './Skeletons';

export default function TopTracks() {
  const [topTracks, setTopTracks] = useState([]);
  const [timeRange, setTimeRange] = useState('medium_term');
  const { data, isLoading } = useQuery({
    queryKey: ['top-tracks', timeRange],
    queryFn: async () => {
      const accessToken = await fetchAccessToken();
      return fetchUsersTopTracks(accessToken, timeRange);
    },
  });

  useEffect(() => {
    if (data) {
      setTopTracks(data.items);
    }
  }, [data]);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };

  return (
    <section>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl md:text-2xl 2xl:text-3xl'>Top Tracks</h2>
        <div className='justify-end flex flex-col md:flex-row items-center gap-2'>
          <Label htmlFor='time-range'>Time Range</Label>
          <Select name='time-range' onValueChange={handleTimeRangeChange}>
            <SelectTrigger className='max-w-[180px] bg-transparent border-white'>
              <SelectValue
                defaultValue={'medium_term'}
                placeholder='Last 6 months'
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='short_term'>Last 4 weeks</SelectItem>
              <SelectItem value='medium_term'>Last 6 months</SelectItem>
              <SelectItem value='long_term'>Several Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='flex flex-col gap-3 md:grid md:grid-cols-2 2xl:grid-cols-3'>
        {isLoading ? (
          <TopTracksSkeleton />
        ) : (
          topTracks.map((tracks: any) => (
            <Card
              key={tracks.id}
              className='p-0 border-none flex items-center gap-4'>
              <div className='flex-shrink-0'>
                <Image
                  className='w-20 h-20 2xl:w-36 2xl:h-36 object-cover'
                  alt='tracks image'
                  width={100}
                  height={100}
                  src={tracks.album.images[0].url}
                />
              </div>
              <CardContent className='p-0 flex flex-col gap-2'>
                <div className='group flex'>
                  <a
                    className='underline font-bold text-sm flex-1 items-center group-hover:text-primary flex gap-2'
                    target='_blank'
                    href={tracks.external_urls.spotify}>
                    <span className='truncate'>
                      {truncateText(tracks.name, 25)}{' '}
                    </span>
                    <ExternalLinkIcon
                      size={16}
                      className='flex-shrink-0 group-hover:text-primary'
                    />
                  </a>
                </div>
                <div className='text-muted-foreground'>
                  <p className='text-sm'>
                    {tracks.artists.map((artist: any, index: number) => (
                      <React.Fragment key={artist.id}>
                        {artist.name}
                        {index < tracks.artists.length - 1 ? ', ' : ''}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
