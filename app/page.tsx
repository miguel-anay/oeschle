"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarcodeInput } from "@/components/barcode-input";

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (barcode: string) => {
    router.push(`/product/${barcode}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold text-foreground">Barcode Scanner</h1>
        <p className="text-muted-foreground">
          Escanea o ingresa un código de barras para buscar productos
        </p>
        <BarcodeInput onSearch={handleSearch} />
        <Link
          href="/history"
          className="inline-block text-sm text-primary hover:underline"
        >
          Ver historial de búsquedas
        </Link>
      </div>
    </main>
  );
}
