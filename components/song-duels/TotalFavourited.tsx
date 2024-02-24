import { Badge } from "../ui/badge";

export default function TotalFavourited() {
  return (
    <div className="flex h-full w-full flex-col gap-2 py-3 text-lg">
      <h3 className="text-center font-bold capitalize">
        Songs added to users Liked Songs
      </h3>
      <Badge className="mx-auto bg-card p-4 text-center text-xl font-medium text-card-foreground">
        <span className="mx-auto text-center tabular-nums">0</span>
      </Badge>
    </div>
  );
}
