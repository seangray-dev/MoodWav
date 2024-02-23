'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SpotifyArtist } from '@/utils/spotify/constants';
import {
  fetchUsersTopArtists,
  isUserFollowingArtist,
} from '@/utils/spotify/spotify';
import { fetchAccessToken } from '@/utils/supabase/fecthAccessToken';
import { useQuery } from '@tanstack/react-query';
import { ExternalLinkIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { TopArtistsSkeleton } from './Skeletons';

interface ArtistWithFollowingInfo extends SpotifyArtist {
  isFollowing: boolean;
}

export default function TopArtists() {
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [artistsWithFollowingInfo, setArtistsWithFollowingInfo] = useState<
    ArtistWithFollowingInfo[]
  >([]);
  const [timeRange, setTimeRange] = useState('medium_term');
  const { data, isLoading } = useQuery({
    queryKey: ['top-artists', timeRange],
    queryFn: async () => {
      const accessToken = await fetchAccessToken();
      return fetchUsersTopArtists(accessToken, timeRange);
    },
  });

  useEffect(() => {
    if (data) {
      setTopArtists(data.items);
    }
  }, [data]);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      const artistIds = topArtists.map((artist) => artist.id).join(',');
      const accessToken = await fetchAccessToken();
      const followingStatuses =
        (await isUserFollowingArtist(accessToken, artistIds)) || [];

      const updatedArtists = topArtists.map((artist, index) => ({
        ...artist,
        isFollowing: followingStatuses[index],
      }));

      setArtistsWithFollowingInfo(updatedArtists);
    };

    if (topArtists && topArtists.length > 0) {
      checkFollowingStatus();
    }
  }, [topArtists]);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  return (
    <section>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl md:text-2xl 2xl:text-3xl'>Top Artists</h2>
        <Select onValueChange={handleTimeRangeChange}>
          <SelectTrigger className='w-[180px] bg-transparent'>
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
      <div className='flex flex-col gap-3 md:grid md:grid-cols-2 2xl:grid-cols-3'>
        {isLoading ? (
          <TopArtistsSkeleton />
        ) : (
          artistsWithFollowingInfo.map((artist: any) => (
            <Card
              key={artist.id}
              className='p-0 border-none flex items-center gap-4'>
              <div className='flex-shrink-0'>
                <Image
                  className='w-24 h-24 2xl:w-36 2xl:h-36 object-cover'
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
                {artist.isFollowing ? (
                  <Badge className='w-fit'>Following</Badge>
                ) : (
                  <Badge variant={'destructive'} className='w-fit'>
                    Not Following
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
