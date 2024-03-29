import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  checkIfTrackIsSaved,
  removeTrackForCurrentUser,
  saveTrackForCurrentUser,
} from "@/utils/spotify/spotify";
import { addedToLibraryCount } from "@/utils/supabase/db";
import { fetchAccessToken } from "@/utils/supabase/fecthAccessToken";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

const Filled = () => {
  return (
    <svg
      className="max-h-[36px] max-w-[36px]"
      width="150"
      height="150"
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="like-svg-path !fill-destructive"
        d="M125.784 35.0369C113.039 22.2916 92.9859 21.3682 79.1227 32.8994C79.1062 32.9135 77.318 34.3807 75 34.3807C72.6234 34.3807 70.9266 32.9416 70.8609 32.8853C57.0141 21.3682 36.9609 22.2916 24.2156 35.0369C17.6695 41.583 14.0625 50.28 14.0625 59.5478C14.0625 68.808 17.6695 77.5127 24.0914 83.9228L64.3078 131.006C66.9844 134.14 70.882 135.938 75 135.938C79.1203 135.938 83.0156 134.14 85.6922 131.009L125.782 84.0611C139.301 70.5447 139.301 48.5533 125.784 35.0369ZM122.346 80.8807L82.1297 127.964C80.3461 130.05 77.7469 131.25 75"
        fill="none"
      />
    </svg>
  );
};

const Outline = () => {
  return (
    <svg
      className="max-h-[36px] max-w-[36px]"
      width="150"
      height="150"
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="like-svg-path"
        d="M125.784 35.0369C113.039 22.2916 92.9859 21.3682 79.1227 32.8994C79.1062 32.9135 77.318 34.3807 75 34.3807C72.6234 34.3807 70.9266 32.9416 70.8609 32.8853C57.0141 21.3682 36.9609 22.2916 24.2156 35.0369C17.6695 41.583 14.0625 50.2877 14.0625 59.5478C14.0625 68.808 17.6695 77.5127 24.0914 83.9228L64.3078 131.006C66.9844 134.14 70.882 135.938 75 135.938C79.1203 135.938 83.0156 134.14 85.6922 131.009L125.782 84.0611C139.301 70.5447 139.301 48.5533 125.784 35.0369ZM122.346 80.8807L82.1297 127.964C80.3461 130.05 77.7469 131.25 75 131.25C72.2531 131.25 69.6562 130.053 67.8703 127.964L27.532 80.7447C21.8695 75.0822 18.75 67.5541 18.75 59.5478C18.75 51.5392 21.8695 44.0135 27.5297 38.351C33.3961 32.4822 41.0555 29.5127 48.7336 29.5127C55.4742 29.5127 62.2289 31.8025 67.7977 36.4338C68.0977 36.7033 70.8586 39.0682 75 39.0682C79.0266 39.0682 81.8578 36.7314 82.1367 36.49C94.1109 26.5291 111.45 27.3307 122.47 38.351C134.159 50.0393 134.159 69.0564 122.346 80.8807Z"
        fill="#535353"
      />
    </svg>
  );
};

const LikeButton = ({ song }: any) => {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkSavedStatus = async () => {
      const accessToken = await fetchAccessToken();
      const isSaved = await checkIfTrackIsSaved(accessToken, song.id);
      setIsLiked(isSaved);
    };

    checkSavedStatus();
  }, [song.id]);

  // Extract artist names
  const artistNames = song.artists.map((artist: any) => artist.name).join(", ");

  const toggleLike = async () => {
    try {
      const accessToken = await fetchAccessToken();

      if (!isLiked) {
        // Save track to Spotify library
        await saveTrackForCurrentUser(accessToken, song.id);
        await addedToLibraryCount(song.id);
        toast({
          title: "Added to Liked Songs:",
          description: `${song.name} by ${artistNames}`,
        });
      } else {
        // Remove track from Spotify library
        await removeTrackForCurrentUser(accessToken, song.id);
        toast({
          title: "Removed from Liked Songs:",
          description: `${song.name} by ${artistNames}`,
        });
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling track like status", error);
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: error.message,
        });
      }
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className="like-button w-fit justify-start p-0 hover:bg-transparent"
            onClick={toggleLike}
          >
            {isLiked ? <Filled /> : <Outline />}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {!isLiked
            ? "Add to Your Spotify Library"
            : "Remove from Your Spotify Library"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LikeButton;
