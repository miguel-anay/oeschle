"use client";

import { SearchX, AlertTriangle, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ERROR_VARIANT = {
  NOT_FOUND: "not_found",
  ERROR: "error",
} as const;

type ErrorVariant = (typeof ERROR_VARIANT)[keyof typeof ERROR_VARIANT];

interface ErrorStateProps {
  title?: string;
  message?: string;
  variant?: ErrorVariant;
  onRetry?: (() => void) | null;
  retryHref?: string;
  retryLabel?: string;
}

const DEFAULT_TITLE = "Producto no encontrado";
const DEFAULT_MESSAGE = "Verifica el código e intenta de nuevo";
const DEFAULT_RETRY_LABEL = "Buscar de nuevo";

const VARIANT_CONFIG: Record<
  ErrorVariant,
  { icon: LucideIcon; iconBg: string; iconColor: string }
> = {
  [ERROR_VARIANT.NOT_FOUND]: {
    icon: SearchX,
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
  [ERROR_VARIANT.ERROR]: {
    icon: AlertTriangle,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
  },
};

export function ErrorState({
  title,
  message,
  variant = ERROR_VARIANT.NOT_FOUND,
  onRetry,
  retryHref,
  retryLabel,
}: ErrorStateProps) {
  const displayTitle = title ?? DEFAULT_TITLE;
  const displayMessage = message ?? DEFAULT_MESSAGE;
  const displayRetryLabel = retryLabel ?? DEFAULT_RETRY_LABEL;
  const config = VARIANT_CONFIG[variant];
  const IconComponent = config.icon;

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
        "animate-fadeInUp space-y-4",
        "p-6 py-8"
      )}
    >
      <div
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-full",
          config.iconBg
        )}
      >
        <IconComponent
          data-testid="error-icon"
          className={cn("h-10 w-10", config.iconColor)}
          aria-hidden="true"
        />
      </div>

      <h2 className="text-2xl font-bold text-foreground">{displayTitle}</h2>

      <p className="max-w-sm text-muted-foreground">{displayMessage}</p>

      {retryHref ? (
        <Link href={retryHref}>
          <Button className="min-h-[44px] w-full sm:w-auto">
            {displayRetryLabel}
          </Button>
        </Link>
      ) : (
        <Button
          onClick={handleRetry}
          className="min-h-[44px] w-full sm:w-auto"
        >
          {displayRetryLabel}
        </Button>
      )}
    </div>
  );
}

export { ERROR_VARIANT };
export type { ErrorVariant };
