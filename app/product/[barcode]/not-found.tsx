import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-6 sm:min-h-[calc(100vh-4rem)] sm:py-8 lg:py-12">
      <div className="w-full max-w-md space-y-6 text-center sm:space-y-8">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
            <path d="M8 8h6" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold sm:text-3xl">Producto no encontrado</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Verifica el código de barras e intenta de nuevo
        </p>

        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:text-base"
        >
          Volver a buscar
        </Link>
      </div>
    </main>
  );
}
