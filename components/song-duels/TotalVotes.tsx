"use client";

import useRealtimeVotes from "@/hooks/useRealTimeVotes";
import { Badge } from "../ui/badge";

export default function TotalVotes() {
  const { totalVotes } = useRealtimeVotes();
  return (
    <div className="flex h-full w-full flex-col gap-2 border-b py-3 text-lg md:border-b-0 md:border-r">
      <h3 className="text-center font-bold capitalize">
        Total amount of votes made
      </h3>
      <Badge className="mx-auto bg-secondary p-4 text-center text-xl font-medium text-card-foreground dark:bg-card">
        <span className="mx-auto text-center tabular-nums">{totalVotes}</span>
      </Badge>
    </div>
  );
}
