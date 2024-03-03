"use client";

import SpotifyIcon from "@/assets/images/Spotify_Icon_RGB_Green.png";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchRecentlyPlayedTracks } from "@/server/actions";
import { fetchAccessToken } from "@/utils/supabase/fecthAccessToken";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { useState } from "react";
import { RecentTracksSkeleton } from "./Skeletons";

export default function RecentlyPlayed() {
  const { data: recentTracks, isLoading } = useQuery({
    queryKey: ["recently-played"],
    queryFn: async () => {
      const accessToken = await fetchAccessToken();
      return fetchRecentlyPlayedTracks(accessToken);
    },
  });

  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    "Blissful",
    "Serenity",
    "Melancholic",
    "Vibrant",
    "Nostalgic",
    "Reflective",
  ];

  const filteredTracks = selectedMood
    ? recentTracks?.filter(
        (track) => track.mood.toLowerCase() === selectedMood.toLowerCase(),
      )
    : recentTracks;

  return (
    <div className="mb-10 mt-20 flex flex-col">
      <div className="flex flex-col items-center justify-between md:flex-row">
        <h2 className="mb-6 text-lg font-medium md:text-2xl">
          Recently Played
        </h2>
        <div className="mb-8 flex items-center justify-end gap-4">
          <Filter />
          <Select
            disabled={isLoading}
            value={selectedMood || "all"}
            onValueChange={(value) =>
              setSelectedMood(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-[180px] border-white bg-transparent">
              <SelectValue placeholder="Filter by mood" />
            </SelectTrigger>
            <SelectContent className="bg-card text-card-foreground">
              <SelectGroup>
                <SelectItem value="all">All Moods</SelectItem>
                {moods.map((mood) => (
                  <SelectItem key={mood} value={mood.toLowerCase()}>
                    {mood}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ul className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <RecentTracksSkeleton />
        ) : filteredTracks && filteredTracks.length > 0 ? (
          filteredTracks.map((track, idx) => (
            <li key={idx} className="w-full">
              <Card className="flex w-full items-center gap-6 border-none bg-card text-card-foreground drop-shadow-2xl">
                <img
                  className="w-1/4"
                  src={track.coverArt || SpotifyIcon.src}
                  alt={track.name}
                />
                <div className="flex flex-col gap-2 overflow-hidden">
                  <p className="truncate font-bold">{track.name}</p>
                  <p className="truncate text-muted-foreground">
                    {track.artistName}
                  </p>
                </div>
              </Card>
            </li>
          ))
        ) : (
          <p className="text-white">No tracks match the selected mood.</p>
        )}
      </ul>
    </div>
  );
}
