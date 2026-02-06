import Link from "next/link";
import { HistoryList } from "@/components/history-list";

export const metadata = {
  title: "Historial de Búsquedas | Barcode Scanner",
  description: "Tu historial de productos consultados",
};

export default function HistoryPage() {
  return (
    <main role="main" className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Historial</h1>
          <Link
            href="/"
            className="text-sm text-primary hover:underline"
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
