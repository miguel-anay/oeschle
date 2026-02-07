"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useHistoryStore } from "@/store/history";
import { HistoryItem } from "./history-item";
import { HistoryToast, TOAST_STATUS } from "./history-toast";
import type { ToastStatus, ToastAction } from "./history-toast";
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

interface ToastState {
  isVisible: boolean;
  message: string;
  status: ToastStatus;
  action?: ToastAction;
}

const INITIAL_TOAST_STATE: ToastState = {
  isVisible: false,
  message: "",
  status: TOAST_STATUS.SUCCESS,
  action: undefined,
};

export function HistoryList() {
  const router = useRouter();
  const { items, clearHistory } = useHistoryStore();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [toast, setToast] = useState<ToastState>(INITIAL_TOAST_STATE);

  const safeItems = items ?? [];
  const isEmpty = safeItems.length === 0;

  const handleDismissToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const handleItemClick = (code: string) => {
    router.push(`/product/${code}`);
  };

  const handleClearClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmClear = async () => {
    const itemCount = safeItems.length;
    setIsClearing(true);

    try {
      await Promise.resolve(clearHistory());

      const message =
        itemCount === 1
          ? "1 producto eliminado del historial"
          : `${itemCount} productos eliminados del historial`;

      setToast({
        isVisible: true,
        message: `${message}. Historial eliminado correctamente`,
        status: TOAST_STATUS.SUCCESS,
        action: undefined,
      });
    } catch {
      setToast({
        isVisible: true,
        message: "Error al eliminar historial",
        status: TOAST_STATUS.ERROR,
        action: {
          label: "Reintentar",
          onClick: () => {
            handleDismissToast();
            handleConfirmClear();
          },
        },
      });
    } finally {
      setIsClearing(false);
      setShowConfirmDialog(false);
    }
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
            className="min-h-[44px] w-full rounded-md border border-destructive px-4 py-2 text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground sm:w-auto"
          >
            Limpiar historial
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="animate-fadeIn rounded-lg border border-dashed p-8 text-center transition-opacity duration-300">
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
            <AlertDialogAction
              onClick={handleConfirmClear}
              disabled={isClearing}
            >
              {isClearing ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <HistoryToast
        message={toast.message}
        status={toast.status}
        isVisible={toast.isVisible}
        onDismiss={handleDismissToast}
        action={toast.action}
      />
    </section>
  );
}
