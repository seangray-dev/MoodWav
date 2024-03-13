import TotalAddedToLibrary from "./TotalAddedToLibrary";
import TotalVotes from "./TotalVotes";

export default function Stats() {
  return (
    <div className="flex flex-col justify-evenly border-x border-b border-white bg-transparent md:flex-row md:gap-10">
      <TotalVotes />
      <TotalAddedToLibrary />
    </div>
  );
}
