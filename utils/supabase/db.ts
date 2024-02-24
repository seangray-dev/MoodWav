import { Song } from "../spotify/constants";
import { supabase } from "./client";

export const insertSongsToDb = async (songs: Song[]) => {
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
          added_to_library_count: 0,
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

export const addedToLibraryCount = async (songId: string) => {
  try {
    const { data, error } = await supabase.rpc(
      "increment_added_to_library_count",
      {
        song_id: songId,
      },
    );

    if (error) throw new Error(error.message);

    console.log(`Updated library date for song ID: ${songId}`);
  } catch (error) {
    console.error("Error updating song library date:", error);
  }
};
