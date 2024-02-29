import Loader from "@/components/layout/Loader";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LeaderBoardSkeleton() {
  return (
    <>
      <h2 className="prose dark:prose-invert py-4">Top 10 Voted On Songs</h2>
      <Table>
        <TableCaption>A list of top voted songs.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Track</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead className="text-center">Votes</TableHead>
            <TableHead className="truncate text-right">
              Open in Spotify
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }, (_, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 animate-pulse bg-secondary"></div>
                  <div className="h-6 w-2/3 animate-pulse bg-secondary">
                    <span className="opacity-0">track name</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="h-6 w-1/2 animate-pulse bg-secondary">
                  <span className="opacity-0">artist</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span className="h-6 w-1/4 animate-pulse bg-secondary">
                  <span className="opacity-0">10000</span>
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className="h-6 w-1/4 animate-pulse bg-secondary">
                  <span className="opacity-0">10000</span>
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
