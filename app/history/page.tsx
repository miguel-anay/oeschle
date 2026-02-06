"use client";

import Link from "next/link";
import { useHistoryStore } from "@/store/history";

export default function HistoryPage() {
  const items = useHistoryStore((state) => state.items);
  const clearHistory = useHistoryStore((state) => state.clearHistory);

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Historial</h1>
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Volver
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No hay búsquedas recientes</p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              Buscar un producto
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <Link
                  key={item.code}
                  href={`/product/${item.code}`}
                  className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="h-12 w-12 rounded object-contain"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                      <span className="text-xs text-muted-foreground">N/A</span>
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">{item.code}</p>
                  </div>
                </Link>
              ))}
            </div>

            <button
              onClick={clearHistory}
              className="w-full rounded-md border border-destructive px-4 py-2 text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Limpiar historial
            </button>
          </>
        )}
      </div>
    </main>
  );
}
