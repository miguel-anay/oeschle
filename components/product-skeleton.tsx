import { cn } from "@/lib/utils";

const SHIMMER_OVERLAY = "relative overflow-hidden";

function ShimmerOverlay() {
  return <div className="absolute inset-0 animate-shimmer" />;
}

export function ProductSkeleton() {
  return (
    <div
      data-testid="product-skeleton"
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading product information"
      className="animate-pulse space-y-4"
    >
      <div
        data-testid="skeleton-image"
        className={cn("h-48 rounded-lg bg-slate-200", SHIMMER_OVERLAY)}
      >
        <ShimmerOverlay />
      </div>
      <div
        data-testid="skeleton-name"
        className={cn("h-6 w-3/4 rounded bg-slate-200", SHIMMER_OVERLAY)}
      >
        <ShimmerOverlay />
      </div>
      <div
        data-testid="skeleton-details"
        className={cn("h-4 w-1/2 rounded bg-slate-200", SHIMMER_OVERLAY)}
      >
        <ShimmerOverlay />
      </div>
    </div>
  );
}
