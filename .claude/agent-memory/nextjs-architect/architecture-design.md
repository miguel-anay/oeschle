# Barcode Scanner App - Detailed Architecture

## Folder Structure

```
barcode-scanner/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── globals.css
│   ├── product/[barcode]/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│   └── history/
│       └── page.tsx
├── actions/
│   ├── product.ts
│   └── product.adapter.ts
├── components/
│   ├── ui/ (shadcn)
│   ├── layout/
│   │   ├── header.tsx
│   │   └── container.tsx
│   ├── barcode-input.tsx
│   ├── product-card.tsx
│   ├── product-skeleton.tsx
│   ├── history-list.tsx
│   ├── history-item.tsx
│   ├── error-state.tsx
│   ├── empty-state.tsx
│   └── camera-scanner.tsx
├── hooks/
│   └── use-history.ts
├── lib/
│   ├── utils.ts
│   ├── validators.ts
│   └── price-generator.ts
├── store/
│   └── history.ts
├── types/
│   └── product.ts
└── public/
```

## Type Definitions

```typescript
// types/product.ts
interface ProductNutriments {
  energy_kcal_100g: number;
  proteins_100g: number;
  carbohydrates_100g: number;
  fat_100g: number;
}

interface Product {
  code: string;
  product_name: string;
  brands: string;
  image_url: string;
  categories: string;
  nutriments: ProductNutriments;
  price: number; // Generated S/. 5-150
}

interface SearchHistoryItem {
  code: string;
  product_name: string;
  image_url: string;
  searched_at: string; // ISO date
}

interface ApiProductResponse {
  status: number;
  product: {
    code: string;
    product_name: string;
    brands: string;
    image_url: string;
    categories: string;
    nutriments: Record<string, number>;
  };
}
```

## Server Action Pattern

```typescript
// actions/product.ts
"use server";

import { adaptProduct } from "./product.adapter";

const API_BASE = "https://world.openfoodfacts.org/api/v0/product";

export async function getProduct(barcode: string) {
  const res = await fetch(`${API_BASE}/${barcode}.json`);
  const data = await res.json();

  if (data.status !== 1) {
    throw new Error("Product not found");
  }

  return adaptProduct(data.product);
}
```

## Zustand Store Pattern

```typescript
// store/history.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HistoryState {
  items: SearchHistoryItem[];
  addItem: (item: SearchHistoryItem) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [
            item,
            ...state.items.filter((i) => i.code !== item.code)
          ].slice(0, 20),
        })),
      clearHistory: () => set({ items: [] }),
    }),
    { name: "search-history" }
  )
);
```

## Component Client/Server Split

| Component | Directive | Reason |
|-----------|-----------|--------|
| barcode-input | "use client" | useState, onChange handlers |
| product-card | Server | Pure display, no interactivity |
| product-skeleton | Server | Pure CSS animation |
| history-list | "use client" | Uses Zustand store |
| history-item | Server | Pure display |
| error-state | Server | Pure display |
| empty-state | Server | Pure display |
| camera-scanner | "use client" | html5-qrcode, browser APIs |
| header | Server | Links only (Next.js Link) |

## Validation

```typescript
// lib/validators.ts
const BARCODE_REGEX = /^\d{6,13}$/;

export function isValidBarcode(code: string): boolean {
  return BARCODE_REGEX.test(code);
}
```

## Price Generator

```typescript
// lib/price-generator.ts
export function generatePrice(barcode: string): number {
  let hash = 0;
  for (let i = 0; i < barcode.length; i++) {
    hash = ((hash << 5) - hash) + barcode.charCodeAt(i);
    hash = hash & hash;
  }
  // Range: S/. 5-150
  return Math.abs(hash % 146) + 5;
}
```
