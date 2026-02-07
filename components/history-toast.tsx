"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const TOAST_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
} as const;

type ToastStatus = (typeof TOAST_STATUS)[keyof typeof TOAST_STATUS];

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface HistoryToastProps {
  message: string;
  status: ToastStatus;
  isVisible: boolean;
  onDismiss: () => void;
  action?: ToastAction;
  autoDismissMs?: number;
}

export function HistoryToast({
  message,
  status,
  isVisible,
  onDismiss,
  action,
  autoDismissMs = 3000,
}: HistoryToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [isVisible, onDismiss, autoDismissMs]);

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onDismiss();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  const statusClasses =
    status === TOAST_STATUS.SUCCESS
      ? "success bg-green-50 border-green-200 text-green-800"
      : "error bg-red-50 border-red-200 text-red-800";

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4">
      <div
        ref={toastRef}
        role="status"
        aria-live="polite"
        aria-label={status}
        className={`toast bottom-4 w-full max-w-md rounded-lg border p-4 shadow-lg ${statusClasses}`}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="flex-1 text-sm font-medium">{message}</p>
          <div className="flex items-center gap-2">
            {action && (
              <button
                type="button"
                onClick={action.onClick}
                className="min-h-[44px] min-w-[44px] rounded-md px-3 py-2 text-sm font-medium hover:bg-black/5"
                tabIndex={0}
              >
                {action.label}
              </button>
            )}
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Cerrar"
              className="flex items-center justify-center rounded-md hover:bg-black/5"
              style={{ minHeight: "44px", minWidth: "44px" }}
              tabIndex={0}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { TOAST_STATUS };
export type { ToastStatus, ToastAction };
