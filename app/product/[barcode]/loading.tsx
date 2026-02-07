import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <main className="mx-auto w-full max-w-2xl py-6 sm:py-8 lg:py-12">
      <div className="space-y-6">
        <Skeleton className="h-4 w-24" />

        <div className="rounded-lg border bg-card p-4 shadow-sm sm:p-6">
          <Skeleton className="mx-auto mb-4 h-48 w-48 rounded-lg sm:h-64 sm:w-64" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
          <Skeleton className="mt-1 h-4 w-2/3" />
          <Skeleton className="mt-4 h-8 w-24" />

          <div className="mt-6 space-y-2">
            <Skeleton className="h-4 w-40" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
