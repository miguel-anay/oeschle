"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: (() => void) | null;
}

const DEFAULT_TITLE = "Producto no encontrado";
const DEFAULT_MESSAGE = "Verifica el código e intenta de nuevo";
const BUTTON_TEXT = "buscar de nuevo";

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  const displayTitle = title ?? DEFAULT_TITLE;
  const displayMessage = message ?? DEFAULT_MESSAGE;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <div
      data-testid="error-state"
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "space-y-4 gap-4",
        "p-6 py-8",
        "bg-slate-50 border border-slate-200 rounded-lg"
      )}
    >
      <Search
        data-testid="error-icon"
        className="w-16 h-16 text-slate-400"
        aria-hidden="true"
      />
      <h2 className="text-2xl font-bold text-slate-900">{displayTitle}</h2>
      <p className="text-slate-600">{displayMessage}</p>
      <Button
        onClick={handleRetry}
        className={cn(
          "w-full sm:w-auto",
          "bg-primary text-primary-foreground",
          "px-6 py-2 rounded-md",
          "hover:bg-primary/90"
        )}
      >
        {BUTTON_TEXT}
      </Button>
    </div>
  );
}