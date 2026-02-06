"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHistoryStore } from "@/store/history";
import { HistoryItem } from "./history-item";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function HistoryList() {
  const router = useRouter();
  const { items, clearHistory } = useHistoryStore();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const safeItems = items ?? [];
  const isEmpty = safeItems.length === 0;

  const handleItemClick = (code: string) => {
    router.push(`/product/${code}`);
  };

  const handleClearClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmClear = () => {
    clearHistory();
    setShowConfirmDialog(false);
  };

  const handleCancelClear = () => {
    setShowConfirmDialog(false);
  };

  return (
    <section
      role="region"
      aria-label="Historial de búsquedas"
      className="w-full"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Historial de Búsquedas</h2>
        {!isEmpty && (
          <button
            type="button"
            onClick={handleClearClick}
            aria-label="Limpiar historial"
            className="w-full rounded-md border border-destructive px-4 py-2 text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground sm:w-auto"
          >
            Limpiar historial
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <img
            src="/empty-search.svg"
            alt="Empty state"
            role="img"
            className="mx-auto mb-4 h-24 w-24 opacity-50"
          />
          <p className="font-medium text-muted-foreground">
            No hay búsquedas recientes
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Busca un producto para comenzar
          </p>
        </div>
      ) : (
        <ul role="list" className="space-y-2">
          {safeItems.map((item) => (
            <li key={item.code} role="listitem">
              <HistoryItem item={item} onClick={handleItemClick} />
            </li>
          ))}
        </ul>
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará todo tu historial de búsquedas. Esta acción
              no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelClear}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClear}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
