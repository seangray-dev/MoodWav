"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchUsersTopTracks } from "@/utils/spotify/spotify";
import { fetchAccessToken } from "@/utils/supabase/fecthAccessToken";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MusicCard } from "../ui/MusicCard";
import { Label } from "../ui/label";
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
      <ul className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <TopTracksSkeleton />
        ) : (
          data.items.map((track: any, idx: number) => (
            <li key={idx} className="w-full">
              <MusicCard type="track" item={track} />
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
