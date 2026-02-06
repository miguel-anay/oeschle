import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SearchHistoryItem } from "@/types/product";

const MAX_HISTORY_ITEMS = 20;

interface HistoryState {
  items: SearchHistoryItem[];
  addItem: (item: Omit<SearchHistoryItem, "searched_at">) => void;
  clearHistory: () => void;
  removeItem: (code: string) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const newItem: SearchHistoryItem = {
            ...item,
            searched_at: new Date().toISOString(),
          };

          const filteredItems = state.items.filter((i) => i.code !== item.code);
          const updatedItems = [newItem, ...filteredItems].slice(0, MAX_HISTORY_ITEMS);

          return { items: updatedItems };
        }),

      clearHistory: () => set({ items: [] }),

      removeItem: (code) =>
        set((state) => ({
          items: state.items.filter((i) => i.code !== code),
        })),
    }),
    {
      name: "search-history",
    }
  )
);
