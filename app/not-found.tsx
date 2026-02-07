import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4 py-6 sm:min-h-[calc(100vh-4rem)] sm:py-8 lg:py-12">
      <h2 className="text-xl font-semibold sm:text-2xl">Página no encontrada</h2>
      <p className="text-sm text-muted-foreground sm:text-base">La página que buscas no existe</p>
      <Link
        href="/"
        className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
