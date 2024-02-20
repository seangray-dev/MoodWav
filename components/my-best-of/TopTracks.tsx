import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExternalLinkIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Card, CardContent } from '../ui/card';

export default function TopTracks({
  topTracks,
  setTimeFrame,
}: {
  topTracks: any;
  setTimeFrame: (timeFrame: string) => void;
}) {
  const handleTimeFrameChange = (selectedTimeFrame: string) => {
    setTimeFrame(selectedTimeFrame);
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
        <Select onValueChange={handleTimeFrameChange}>
          <SelectTrigger className='w-[180px] bg-transparent'>
            <SelectValue placeholder='Time Range' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='short_term'>Short</SelectItem>
            <SelectItem value='medium_term'>Medium</SelectItem>
            <SelectItem value='long_term'>Long</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='flex flex-col gap-3 md:grid md:grid-cols-2 2xl:grid-cols-3'>
        {topTracks ? (
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
                      {/* Adjust maxLength as needed */}
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
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </section>
  );
}
