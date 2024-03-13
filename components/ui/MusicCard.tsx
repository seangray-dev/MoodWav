import SpotifyIcon from "@/assets/images/Spotify_Icon_RGB_Green.png";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import { NumericFormat } from "react-number-format";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Card } from "./card";

export const MusicCard = ({ type, item }: any) => {
  const imageUrl =
    type === "track"
      ? item.coverArt || item.album.images[0].url
      : item.images[0].url;
  const title = item.name;
  const spotifyUrl =
    type === "track" ? `spotify:track:${item.id}` : `spotify:artist:${item.id}`;

  const isFollowing = item.isFollowing;

  return (
    <Card className="flex w-full items-center gap-6 border-none bg-card text-card-foreground">
      <img
        className="h-24 w-24 object-cover 2xl:h-36 2xl:w-36"
        src={imageUrl}
        alt={title}
      />
      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        <a
          className="flex w-fit flex-1 items-center gap-2 text-sm font-bold underline hover:text-primary"
          target="_blank"
          href={spotifyUrl}
        >
          <span title={title} className="truncate">
            {title}
          </span>
          <ExternalLinkIcon
            size={16}
            className="flex-shrink-0 hover:text-primary"
          />
        </a>
        <div className="flex flex-col gap-2 text-muted-foreground">
          <div className="truncate text-sm">
            {type === "track" &&
              item.artists.map((artist: any, index: any) => (
                <a
                  key={artist.id}
                  className="hover:text-primary hover:underline"
                  href={`spotify:artist:${artist.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {artist.name}
                  {index < item.artists.length - 1 ? ", " : ""}
                </a>
              ))}
            {type === "artist" && (
              <p>
                Followers:{" "}
                <NumericFormat
                  displayType="text"
                  className="bg-transparent"
                  value={item.followers.total}
                  allowLeadingZeros
                  thousandSeparator=","
                />
              </p>
            )}
          </div>
          {type === "artist" && (
            <Badge
              variant={isFollowing ? "default" : "destructive"}
              className="w-fit"
            >
              {isFollowing ? "Following" : "Not Following"}
            </Badge>
          )}
        </div>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <a href={spotifyUrl} target="_blank" rel="noopener noreferrer">
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
              {type === "track" ? "Play" : "Open"}{" "}
              <span className="font-bold underline">{title}</span> on Spotify
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Card>
  );
};
