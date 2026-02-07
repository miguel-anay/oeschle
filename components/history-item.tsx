"use client";

import type { SearchHistoryItem } from "@/types/product";

interface HistoryItemProps {
  item: SearchHistoryItem;
  onClick: (code: string) => void;
}

export function HistoryItem({ item, onClick }: HistoryItemProps) {
  const formattedDate = new Date(item.searched_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleClick = () => {
    onClick(item.code);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(item.code);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`Ver producto ${item.product_name}`}
      className="flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:gap-4 sm:p-4"
    >
      <img
        src={item.image_url || "/placeholder.png"}
        alt={item.product_name}
        className="h-16 w-16 rounded object-contain"
      />
      <div className="flex-1 overflow-hidden">
        <p className="truncate font-medium">{item.product_name}</p>
        <p className="text-sm text-muted-foreground">{item.code}</p>
        <p className="text-xs text-muted-foreground">{formattedDate}</p>
      </div>
    </button>
  );
}
