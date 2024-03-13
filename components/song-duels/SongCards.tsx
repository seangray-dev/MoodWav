"use client";

import SpotifyIcon from "@/assets/images/Spotify_Icon_RGB_Green.png";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useRecommendations from "@/hooks/useRecommendations";
import { Song } from "@/utils/spotify/constants";
import { supabase } from "@/utils/supabase/client";
import { insertSongsToDb } from "@/utils/supabase/db";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Loader from "../layout/Loader";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import LikeButton from "./LikeButton";

export default function SongCards() {
  const { recommendations, loading, fetchMore } = useRecommendations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [songPair, setSongPair] = useState<any[]>([]);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const audioPlayersRef = useRef<{ [key: string]: AudioPlayer | null }>({});

  useEffect(() => {
    if (recommendations.length >= 2 && currentIndex < recommendations.length) {
      const initialPair = recommendations.slice(currentIndex, currentIndex + 2);
      setSongPair(initialPair);
    }
  }, [recommendations, currentIndex]);

  const serveNextPair = async () => {
    setCurrentPlaying(null);
    const nextIndex = currentIndex + 2;

    // Preemptively fetch more recommendations if nearing the end
    if (nextIndex >= recommendations.length - 2) {
      // append new recommendations
      await fetchMore();
    }

    // Wait for the fetchMore process to complete and then update the song pair and index
    if (nextIndex < recommendations.length) {
      const nextPair = recommendations.slice(nextIndex, nextIndex + 2);
      setSongPair(nextPair);
      setCurrentIndex(nextIndex);
      await insertSongsToDb(nextPair);
    }
  };

  const handleVote = async (song: Song) => {
    const { data, error } = await supabase.rpc("increment_vote", {
      song_id: song.id,
    });

    if (error) {
      console.error("Error voting for song:", error);
    }

    serveNextPair();
  };

  const handlePlay = (songId: string) => {
    // If there's a song currently playing and it's not the one that was just played, pause it
    if (currentPlaying && currentPlaying !== songId) {
      audioPlayersRef?.current[currentPlaying]?.audio.current?.pause();
    }
    setCurrentPlaying(songId);
  };

  if (loading) {
    return <Loader message={"Loading songs..."} />;
  }

  return (
    <section className="pb-10">
      <div className="flex flex-col justify-center gap-10 sm:flex-row md:gap-0">
        {songPair.map((song) => (
          <Card
            key={song.id}
            className="mx-auto flex max-w-[300px] flex-col items-center rounded-t-none border-none bg-secondary p-0 pb-4 text-sm dark:bg-card md:text-base"
          >
            <CardHeader className="h-full w-full p-0">
              <Image
                unoptimized
                priority
                width={300}
                height={300}
                className="h-[300px] w-[300px] object-cover"
                src={song.album.images[0]?.url || ""}
                alt={`Cover art for ${song.name}`}
              />
            </CardHeader>
            <div className="flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <a
                    href={`spotify:track:${song.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary hover:underline"
                  >
                    <h2 className="text-sm font-bold">{song.name}</h2>
                  </a>
                  <p className="text-sm text-muted-foreground">
                    {song.artists.map((artist: any, index: number) => (
                      <React.Fragment key={artist.id}>
                        {index > 0 && ", "}
                        <a
                          href={`spotify:artist:${artist.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary hover:underline"
                        >
                          {artist.name}
                        </a>
                      </React.Fragment>
                    ))}
                  </p>
                  <a
                    href={`spotify:album:${song.album.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary hover:underline"
                  >
                    {song.album.name}
                  </a>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <a
                        href={`spotify:track:${song.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          width={24}
                          height={24}
                          alt="spotify logo"
                          src={SpotifyIcon}
                        />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Play <span className="font-bold">{song.name}</span> on
                        Spotify
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Separator />
              {song.preview_url && (
                <div className="mx-auto w-[250px]">
                  <AudioPlayer
                    className="audio-player !border-none"
                    src={song.preview_url}
                    showJumpControls={false}
                    showDownloadProgress={false}
                    customAdditionalControls={[]}
                    onPlay={() => handlePlay(song.id)}
                    ref={(element) => {
                      audioPlayersRef.current[song.id] = element;
                    }}
                  />
                </div>
              )}
              <div className="flex items-center justify-between gap-4">
                <Button
                  className="flex-1 justify-center"
                  onClick={() => handleVote(song)}
                >
                  Vote
                </Button>
                <LikeButton song={song} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
