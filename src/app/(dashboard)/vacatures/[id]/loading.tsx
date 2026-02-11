import { Loader2 } from "lucide-react";

export default function VacatureLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm font-semibold text-muted-foreground">
          Vacature laden...
        </p>
      </div>
    </div>
  );
}
