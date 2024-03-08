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
import { MusicCard } from "../ui/MusicCard";
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
      <ul className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <TopArtistsSkeleton />
        ) : (
          topArtists.map((artist: any, idx: number) => (
            <li key={idx} className="w-full">
              <MusicCard type="artist" item={artist} />
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
