"use client";

import useRealtimeVotes from "@/hooks/useRealTimeVotes";
import { Badge } from "../ui/badge";

export default function TotalVotes() {
  const { totalVotes } = useRealtimeVotes();
  return (
    <div className="flex h-full w-full flex-col gap-2 border-r py-3 text-lg">
      <h3 className="text-center font-bold capitalize">
        Total amount of votes made
      </h3>
      <Badge className="mx-auto bg-card p-4 text-center text-xl font-medium text-card-foreground">
        <span className="mx-auto text-center tabular-nums">{totalVotes}</span>
      </Badge>
    </div>
  );
}
