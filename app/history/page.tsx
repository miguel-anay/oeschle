import Link from "next/link";
import { HistoryList } from "@/components/history-list";

export const metadata = {
  title: "Historial de Búsquedas | Barcode Scanner",
  description: "Tu historial de productos consultados",
};

export default function HistoryPage() {
  return (
    <main role="main" className="min-h-screen py-6 sm:py-8 lg:py-12">
      <div className="w-full space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">
            Historial
          </h1>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center text-sm text-primary hover:underline sm:text-base"
            aria-label="Volver a inicio"
          >
            ← Volver
          </Link>
        </div>

        <HistoryList />
      </div>
    </main>
  );
}
