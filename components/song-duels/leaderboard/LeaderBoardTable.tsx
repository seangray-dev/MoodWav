"use client";

import SpotifyIcon from "@/assets/images/Spotify_Icon_RGB_Green.png";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchTrackById } from "@/utils/spotify/spotify";
import { fetchTop10VotedSongs } from "@/utils/supabase/db";
import { fetchAccessToken } from "@/utils/supabase/fecthAccessToken";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LeaderBoardSkeleton from "./LeaderBoardSkeleton";

export default function LeaderBoardTable() {
  const [topVotedSongs, setTopVotedSongs] = useState<any[]>([]);
  const { data, isLoading } = useQuery({
    queryKey: ["topVotedSongs"],
    queryFn: async () => {
      return await fetchTop10VotedSongs();
    },
  });

  useEffect(() => {
    const enrichSongData = async () => {
      if (!data) return;
      const accessToken = await fetchAccessToken();

      const songsWithDetails = await Promise.all(
        data.map(async (song) => {
          const trackDetails = await fetchTrackById(
            accessToken,
            song.spotify_track_id,
          );
          return {
            ...song,
            trackDetails,
          };
        }),
      );

      setTopVotedSongs(songsWithDetails);
    };

    enrichSongData();
  }, [data]);

  if (!topVotedSongs || isLoading) {
    return <LeaderBoardSkeleton />;
  }

  return (
    <>
      <h2 className="py-4 text-white">Top 10 Voted On Songs</h2>
      <Table className="bg-card text-card-foreground">
        <TableHeader>
          <TableRow>
            <TableHead>Track</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead className="text-center">Votes</TableHead>
            <TableHead className="truncate text-right">
              Open in Spotify
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topVotedSongs?.map((song: any) => (
            <TableRow key={song.id}>
              <TableCell className="font-medium">
                <Link
                  target="_blank"
                  href={`spotify:track:${song.spotify_track_id}`}
                  className="flex w-fit items-center gap-4 hover:text-primary hover:underline"
                >
                  <Image
                    width={50}
                    height={50}
                    src={song.trackDetails.album.images[0].url}
                    alt={song}
                  />
                  <span className="truncate">{song.song}</span>
                </Link>
              </TableCell>
              <TableCell>
                {song.trackDetails.artists.map((artist: any, index: number) => (
                  <React.Fragment key={artist.id}>
                    {index > 0 && ", "}
                    <Link
                      href={`spotify:artist:${artist.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:underline"
                    >
                      <span className="truncate">{artist.name}</span>
                    </Link>
                  </React.Fragment>
                ))}
              </TableCell>
              <TableCell className="text-center">{song.vote_count}</TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Link
                    href={`spotify:track:${song.spotify_track_id}`}
                    className="flex flex-col items-center gap-2 text-right hover:text-primary hover:underline"
                  >
                    <Image
                      src={SpotifyIcon}
                      width={24}
                      height={24}
                      className="mx-auto"
                      alt="spotify icon"
                    />
                    <span className="text-xs font-medium">Play on Spotify</span>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
