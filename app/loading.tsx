export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-6 sm:min-h-[calc(100vh-4rem)] sm:py-8 lg:py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent sm:h-10 sm:w-10" />
    </div>
  );
}
