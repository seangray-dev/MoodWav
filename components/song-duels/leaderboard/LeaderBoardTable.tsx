"use client";

import {
  Table,
  TableBody,
  TableCaption,
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
import { useEffect, useState } from "react";

export default function LeaderBoardTable() {
  const [topVotedSongs, setTopVotedSongs] = useState([]);
  const { data, isLoading } = useQuery({
    queryKey: ["topVotedSongs"],
    queryFn: async () => {
      return await fetchTop10VotedSongs();
    },
  });

  // need to get additional data from fetchTrackById to render image and have links

  return (
    <>
      <h2 className="prose dark:prose-invert py-4">Top 10 Voted On Songs</h2>
      <Table>
        <TableCaption>A list of top voted songs.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Track</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead className="text-right">Votes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((song) => (
            <TableRow key={song.id}>
              <TableCell className="font-medium">
                {/* Use actual data for track name and link */}
                <Link
                  href={`link-to-track/${song.spotify_track_id}`}
                  className="flex items-center gap-2"
                >
                  {/* Placeholder for image, replace with actual image source if available */}
                  <Image
                    width={20}
                    height={20}
                    src="/placeholder-image-url.jpg"
                    alt={song}
                  />
                  <span>{song.song}</span>
                </Link>
              </TableCell>
              <TableCell>
                {/* Use actual data for artist name and link */}
                <Link href={`link-to-artist/${song.artist}`}>
                  {song.artist}
                </Link>
              </TableCell>
              <TableCell className="text-right">{song.vote_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
