"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4 py-6 sm:min-h-[calc(100vh-4rem)] sm:py-8 lg:py-12">
      <h2 className="text-xl font-semibold text-destructive sm:text-2xl">Algo salió mal</h2>
      <p className="text-sm text-muted-foreground sm:text-base">{error.message}</p>
      <button
        onClick={reset}
        className="min-h-[44px] rounded-md bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
