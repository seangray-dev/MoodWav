import { Alert } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import SpotifyButton from "../home/SpotifyButton";

export default function AlertMessage({ message }: { message: string }) {
  return (
    <div className="mx-auto flex flex-1 flex-col justify-center gap-6">
      <Alert
        variant={"destructive"}
        className="bg-destructive font-medium text-white"
      >
        <div className="flex items-center gap-2">
          <AlertCircle stroke="white" />
          <span>{message}</span>
        </div>
      </Alert>
      <SpotifyButton />
    </div>
  );
}
