import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h2 className="text-xl font-semibold">Página no encontrada</h2>
      <p className="text-muted-foreground">
        La página que buscas no existe
      </p>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
