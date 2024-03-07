"use client";

import SpotifyIcon from "@/assets/images/Spotify_Icon_RGB_Green.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SpotifyArtist } from "@/utils/spotify/constants";
import {
  fetchUsersTopArtists,
  isUserFollowingArtist,
} from "@/utils/spotify/spotify";
import { fetchAccessToken } from "@/utils/supabase/fecthAccessToken";
import { useQuery } from "@tanstack/react-query";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { TopArtistsSkeleton } from "./Skeletons";

export default function TopArtists() {
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [timeRange, setTimeRange] = useState("medium_term");
  const { data, isLoading } = useQuery({
    queryKey: ["top-artists", timeRange],
    queryFn: async () => {
      const accessToken = await fetchAccessToken();
      return fetchUsersTopArtists(accessToken, timeRange);
    },
  });

  useEffect(() => {
    if (data && data.items) {
      const updateArtistsWithFollowingStatus = async () => {
        const artistIds = data.items.map((artist: any) => artist.id).join(",");
        const accessToken = await fetchAccessToken();
        const followingStatuses =
          (await isUserFollowingArtist(accessToken, artistIds)) || [];

        const updatedArtists = data.items.map((artist: any, index: number) => ({
          ...artist,
          isFollowing: followingStatuses[index],
        }));

        setTopArtists(updatedArtists);
      };

      updateArtistsWithFollowingStatus();
    }
  }, [data]);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl 2xl:text-3xl">Top Artists</h2>
        <div className="flex flex-col items-center justify-end gap-2 md:flex-row">
          <Label htmlFor="time-range">Time Range</Label>
          <Select name="time-range" onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="max-w-[180px] border-white bg-transparent">
              <SelectValue
                defaultValue={"medium_term"}
                placeholder="Last 6 months"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short_term">Last 4 weeks</SelectItem>
              <SelectItem value="medium_term">Last 6 months</SelectItem>
              <SelectItem value="long_term">Several Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 2xl:grid-cols-3">
        {isLoading ? (
          <TopArtistsSkeleton />
        ) : (
          topArtists.map((artist: any) => (
            <Card
              key={artist.id}
              className="flex items-center gap-4 border-none bg-secondary p-0 dark:bg-card"
            >
              <div className="flex-shrink-0">
                <Image
                  unoptimized
                  className="h-24 w-24 object-cover 2xl:h-36 2xl:w-36"
                  alt="artist image"
                  width={100}
                  height={100}
                  src={artist.images[0].url}
                />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <CardContent className="flex flex-col gap-2 p-0">
                  <div className="group">
                    <a
                      className="flex items-center gap-2 text-sm font-bold underline group-hover:text-primary"
                      target="_blank"
                      href={`spotify:artist:${artist.id}`}
                    >
                      {artist.name}
                      <ExternalLinkIcon
                        size={16}
                        className="group-hover:text-primary "
                      />
                    </a>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>
                      Followers:{" "}
                      <NumericFormat
                        displayType="text"
                        className="bg-transparent"
                        value={artist.followers.total}
                        allowLeadingZeros
                        thousandSeparator=","
                      />
                    </p>
                  </div>
                  {artist.isFollowing ? (
                    <Badge className="w-fit">Following</Badge>
                  ) : (
                    <Badge variant={"destructive"} className="w-fit">
                      Not Following
                    </Badge>
                  )}
                </CardContent>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <a
                        href={`spotify:artist:${artist.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          className="mr-6 h-6"
                          width={24}
                          height={24}
                          src={SpotifyIcon}
                          alt="spotify logo"
                        />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Open{" "}
                        <span className="font-bold underline">
                          {artist.name}
                        </span>{" "}
                        on Spotify
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
