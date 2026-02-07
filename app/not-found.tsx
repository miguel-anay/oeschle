import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4 py-6 sm:min-h-[calc(100vh-4rem)] sm:py-8 lg:py-12">
      <div className="animate-fadeInUp flex flex-col items-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
        </div>

        <h2 className="text-xl font-semibold sm:text-2xl">
          Pagina no encontrada
        </h2>

        <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
          La pagina que buscas no existe o fue movida
        </p>

        <Link href="/">
          <Button className="min-h-[44px]">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  );
}
