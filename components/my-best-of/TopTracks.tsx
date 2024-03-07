"use client";

import SpotifyIcon from "@/assets/images/Spotify_Icon_RGB_Green.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchUsersTopTracks } from "@/utils/spotify/spotify";
import { fetchAccessToken } from "@/utils/supabase/fecthAccessToken";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useQuery } from "@tanstack/react-query";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TopTracksSkeleton } from "./Skeletons";

export default function TopTracks() {
  const [timeRange, setTimeRange] = useState("medium_term");
  const { data, isLoading } = useQuery({
    queryKey: ["top-tracks", timeRange],
    queryFn: async () => {
      const accessToken = await fetchAccessToken();
      return fetchUsersTopTracks(accessToken, timeRange);
    },
  });

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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl 2xl:text-3xl">Top Tracks</h2>
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
          <TopTracksSkeleton />
        ) : (
          data.items.map((tracks: any) => (
            <Card
              key={tracks.id}
              className="flex items-center gap-4 border-none bg-secondary p-0 dark:bg-card"
            >
              <div className="flex-shrink-0">
                <Image
                  className="h-20 w-20 object-cover 2xl:h-36 2xl:w-36"
                  alt="tracks image"
                  width={100}
                  height={100}
                  src={tracks.album.images[0].url}
                />
              </div>
              <div className="flex w-full items-center justify-between">
                <CardContent className="flex flex-col gap-2 p-0">
                  <div className="group flex">
                    <a
                      className="flex flex-1 items-center gap-2 text-sm font-bold underline group-hover:text-primary"
                      target="_blank"
                      href={`spotify:track:${tracks.id}`}
                    >
                      <span className="truncate">
                        {truncateText(tracks.name, 25)}{" "}
                      </span>
                      <ExternalLinkIcon
                        size={16}
                        className="flex-shrink-0 group-hover:text-primary"
                      />
                    </a>
                  </div>
                  <div className="text-muted-foreground">
                    <div className="text-sm">
                      {tracks.artists.map((artist: any, index: number) => (
                        <a
                          className="hover:text-primary hover:underline"
                          key={artist.id}
                          href={`spotify:artist:${artist.id}`}
                        >
                          {artist.name}
                          {index < tracks.artists.length - 1 ? ", " : ""}
                        </a>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <a
                        href={`spotify:track:${tracks.id}`}
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
                        Play{" "}
                        <span className="font-bold underline">
                          {tracks.name}
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
