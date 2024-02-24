import TotalFavourited from "./TotalFavourited";
import TotalVotes from "./TotalVotes";

export default function Stats() {
  return (
    <div className="flex flex-col justify-evenly gap-10 border-x border-b bg-transparent md:flex-row">
      <TotalVotes />
      <TotalFavourited />
    </div>
  );
}
