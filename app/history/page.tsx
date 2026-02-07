import { HistoryList } from "@/components/history-list";

export const metadata = {
  title: "Historial de Busquedas | Barcode Scanner",
  description: "Tu historial de productos consultados",
};

export default function HistoryPage() {
  return (
    <main
      role="main"
      className="min-h-[calc(100vh-3.5rem)] py-6 sm:min-h-[calc(100vh-4rem)] sm:py-8 lg:py-12"
    >
      <div className="w-full space-y-6 sm:space-y-8">
        <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">Historial</h1>

        <HistoryList />
      </div>
    </main>
  );
}
