"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Song } from "@/utils/spotify/constants";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Loader from "../layout/Loader";
import { Button } from "../ui/button";
import LikeButton from "./LikeButton";
import { data } from "./data";

export default function SongCards() {
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [songPair, setSongPair] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const audioPlayersRef = useRef<{ [key: string]: AudioPlayer | null }>({});

  // use this function for production
  // const fetchAndSetRecommendations = async () => {
  //   try {
  //     const { data: session } = await supabase.auth.getSession();
  //     const accessToken = session?.session?.provider_token;

  //     if (accessToken) {
  //       setLoading(true);
  //       const fetchedRecommendations = await fetchRecommendations(accessToken);
  //       console.log('Fetched Recommendations:', fetchedRecommendations);
  //       setRecommendations(fetchedRecommendations);
  //       setLoading(false);
  //     } else {
  //       console.log('No access token available.');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching recommendations:', error);
  //     setLoading(false);
  //   }
  // };

  // use this function for testing with mock data from data.js
  const fetchAndSetRecommendations = async () => {
    try {
      setLoading(true);
      const recommendations = data;
      setRecommendations(recommendations);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetRecommendations();
  }, []);

  useEffect(() => {
    // Ensure that recommendations.tracks is defined before filtering
    if (recommendations.tracks) {
      const filteredData = recommendations.tracks.filter(
        (track) => track.preview_url,
      );
      setRecommendations(filteredData.slice(2)); // Set remaining tracks for future use
      setSongPair(filteredData.slice(0, 2)); // Initialize with the first two tracks
      insertSongsToDb(filteredData.slice(0, 2)); // Insert initial songs into the database if needed
    }
  }, [recommendations]);

  const insertSongsToDb = async (songs: Song[]) => {
    for (const song of songs) {
      const { data, error } = await supabase
        .from("tracks")
        .select("id")
        .eq("spotify_track_id", song.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking song existence:", error);
        continue;
      }

      if (data) {
        console.log("song exists:", data);
      }

      const artists = song.artists
        .map((artist: { name: string }) => artist.name)
        .join(", ");

      if (!data) {
        const { error: insertError } = await supabase.from("tracks").insert([
          {
            spotify_track_id: song.id,
            vote_count: 0,
            song: song.name,
            artist: artists,
            modified_at: new Date(),
          },
        ]);

        if (insertError) {
          console.error("Error inserting song:", insertError);
        } else {
          console.log(`Song inserted: ${song.name}`);
        }
      }
    }
  };

  const serveNextPair = async () => {
    setCurrentPlaying(null);
    setLoading(true);
    if (recommendations.length >= 2) {
      const nextPair = recommendations.slice(0, 2);
      setSongPair(nextPair);
      setRecommendations(recommendations.slice(2));
      await insertSongsToDb(nextPair);
      setLoading(false);
    } else {
      console.log("Fetching more recommendations...");
      await fetchAndSetRecommendations();
    }
  };

  const handleVote = async (song: Song) => {
    console.log(`Voting for song with ID: ${song.id}`);

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
      audioPlayersRef.current[currentPlaying].audio.current.pause();
    }
    setCurrentPlaying(songId);
  };

  if (loading) {
    return <Loader message={"Loading songs..."} />;
  }

  // if (!songPair || songPair.length === 0) {
  //   return <div>No more songs to display.</div>;
  // }

  return (
    <div className="flex flex-col justify-center gap-10 sm:flex-row md:gap-0">
      {songPair.map((song) => (
        <Card
          key={song.id}
          className="mx-auto flex max-w-[300px] flex-col items-center rounded-t-none border-none p-0 pb-4 text-sm md:text-base"
        >
          <CardHeader className="h-full w-full p-0">
            <Image
              width={300}
              height={300}
              className="h-full w-full object-cover"
              src={song.album.images[0]?.url || ""}
              alt={`Cover art for ${song.name}`}
            />
          </CardHeader>
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold">{song.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {song.artists
                    .map((artist: { name: string }) => artist.name)
                    .join(", ")}
                </p>
              </div>
              <LikeButton />
            </div>
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
            <Button
              className="w-full justify-center text-white"
              onClick={() => handleVote(song)}
            >
              Vote
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
