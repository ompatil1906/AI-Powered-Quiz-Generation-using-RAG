import * as React from "react"
import { cn } from "../../lib/utils"
import { CheckCircle2, AlertCircle } from "lucide-react"

export const Toast = ({ toast }) => {
  if (!toast) return null;
  
  const isError = toast.type === 'error';
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <div 
        className={cn(
          "pointer-events-auto rounded-md border p-4 shadow-md transition-all flex items-center gap-3",
          isError ? "bg-destructive text-destructive-foreground border-destructive" : "bg-card text-card-foreground border-border"
        )}
      >
        {isError ? (
          <AlertCircle className="h-5 w-5 shrink-0" />
        ) : (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
        )}
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
    </div>
  );
};
