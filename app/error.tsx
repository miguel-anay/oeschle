"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="animate-fadeInUp flex flex-col items-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-10 w-10 text-destructive" aria-hidden="true" />
        </div>

        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          Algo salio mal
        </h2>

        <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
          {error.message || "Ocurrio un error inesperado. Intenta de nuevo."}
        </p>

        <Button onClick={reset} className="min-h-[44px]">
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
}
