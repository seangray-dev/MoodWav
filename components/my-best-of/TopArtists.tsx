import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExternalLinkIcon } from 'lucide-react';
import Image from 'next/image';
import { NumericFormat } from 'react-number-format';
import { Card, CardContent } from '../ui/card';

export default function TopArtists({
  topArtists,
  setTimeFrame,
}: {
  topArtists: any;
  setTimeFrame: (timeFrame: string) => void;
}) {
  const handleTimeFrameChange = (selectedTimeFrame: string) => {
    setTimeFrame(selectedTimeFrame);
  };

  return (
    <section>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl md:text-2xl 2xl:text-3xl'>Top Artists</h2>
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
        {topArtists ? (
          topArtists.map((artist: any) => (
            <Card
              key={artist.id}
              className='p-0 border-none flex items-center gap-4'>
              <div className='flex-shrink-0'>
                <Image
                  className='w-20 h-20 2xl:w-36 2xl:h-36 object-cover'
                  alt='artist image'
                  width={100}
                  height={100}
                  src={artist.images[0].url}
                />
              </div>
              <CardContent className='p-0 flex flex-col gap-2'>
                <div className='group'>
                  <a
                    className='underline font-bold text-sm flex gap-2 items-center group-hover:text-primary '
                    target='_blank'
                    href={artist.external_urls.spotify}>
                    {artist.name}
                    <ExternalLinkIcon
                      size={16}
                      className='group-hover:text-primary '
                    />
                  </a>
                </div>

                <div className='text-muted-foreground text-sm'>
                  <p>
                    Followers:{' '}
                    <NumericFormat
                      displayType='text'
                      className='bg-transparent'
                      value={artist.followers.total}
                      allowLeadingZeros
                      thousandSeparator=','
                    />
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
