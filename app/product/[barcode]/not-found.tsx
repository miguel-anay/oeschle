import { ErrorState } from "@/components/error-state";

export default function ProductNotFound() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-6 sm:min-h-[calc(100vh-4rem)] sm:py-8 lg:py-12">
      <ErrorState
        title="Producto no encontrado"
        message="Verifica el codigo de barras e intenta de nuevo"
        retryHref="/"
        retryLabel="Volver a buscar"
      />
    </main>
  );
}
