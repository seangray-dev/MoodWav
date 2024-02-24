import TotalAddedToLibrary from "./TotalAddedToLibrary";
import TotalVotes from "./TotalVotes";

export default function Stats() {
  return (
    <div className="flex flex-col justify-evenly gap-10 border-x border-b bg-transparent md:flex-row">
      <TotalVotes />
      <TotalAddedToLibrary />
    </div>
  );
}
