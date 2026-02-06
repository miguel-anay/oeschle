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
        className="h-48 bg-slate-200 rounded-lg"
      />
      <div
        data-testid="skeleton-name"
        className="h-6 bg-slate-200 rounded w-3/4"
      />
      <div
        data-testid="skeleton-details"
        className="h-4 bg-slate-200 rounded w-1/2"
      />
    </div>
  );
}
