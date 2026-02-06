---
name: react-query
description: >
  TanStack Query v5 patterns for React data fetching.
  Trigger: When implementing data fetching, caching, or server state with React Query/TanStack Query.
license: Apache-2.0
metadata:
  author: barcode-scanner
  version: "1.0"
  scope: [root]
  auto_invoke: "Using React Query for data fetching"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

## When to Use

- Fetching server data with caching
- Handling loading/error states declaratively
- Background refetching and stale data
- Optimistic updates
- Infinite scroll / pagination

## Critical Patterns

### Provider Setup

```typescript
// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (was cacheTime)
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

```typescript
// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Basic Query

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/actions/product";

export function ProductDisplay({ barcode }: { barcode: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", barcode],
    queryFn: () => getProduct(barcode),
  });

  if (isLoading) return <ProductSkeleton />;
  if (isError) return <ErrorState message={error.message} />;
  if (!data) return <EmptyState />;

  return <ProductCard product={data} />;
}
```

### Skip Query with skipToken (v5 Pattern)

```typescript
import { useQuery, skipToken } from "@tanstack/react-query";

export function ProductSearch({ barcode }: { barcode: string | null }) {
  const { data, isLoading } = useQuery({
    queryKey: ["product", barcode],
    // ✅ v5: Use skipToken instead of enabled: false
    queryFn: barcode ? () => getProduct(barcode) : skipToken,
  });

  return /* ... */;
}
```

### Query with Validation

```typescript
import { useQuery, skipToken } from "@tanstack/react-query";
import { isValidBarcode } from "@/lib/validators";

export function useProduct(barcode: string) {
  return useQuery({
    queryKey: ["product", barcode],
    queryFn: isValidBarcode(barcode)
      ? () => getProduct(barcode)
      : skipToken,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
```

### Mutation (Create/Update/Delete)

```typescript
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddToHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: SearchHistoryItem) => addToHistory(item),
    onSuccess: () => {
      // Invalidate and refetch history
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

// Usage
function SearchButton({ product }: { product: Product }) {
  const { mutate, isPending } = useAddToHistory();

  return (
    <button
      onClick={() => mutate({ ...product, searched_at: new Date().toISOString() })}
      disabled={isPending}
    >
      {isPending ? "Saving..." : "Add to History"}
    </button>
  );
}
```

### Suspense Query (v5)

```typescript
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

function ProductContent({ barcode }: { barcode: string }) {
  // ✅ No need for isLoading check - Suspense handles it
  const { data } = useSuspenseQuery({
    queryKey: ["product", barcode],
    queryFn: () => getProduct(barcode),
  });

  return <ProductCard product={data} />;
}

export function ProductPage({ barcode }: { barcode: string }) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent barcode={barcode} />
    </Suspense>
  );
}
```

### Query Keys Best Practice

```typescript
// ✅ Structured query keys
const productKeys = {
  all: ["products"] as const,
  detail: (barcode: string) => ["products", barcode] as const,
  search: (query: string) => ["products", "search", query] as const,
};

// Usage
useQuery({
  queryKey: productKeys.detail(barcode),
  queryFn: () => getProduct(barcode),
});

// Invalidate all products
queryClient.invalidateQueries({ queryKey: productKeys.all });
```

### Error Handling with TypeScript

```typescript
// Register global error type (v5)
declare module "@tanstack/react-query" {
  interface Register {
    defaultError: Error;
  }
}

// Now error is typed as Error, not unknown
const { error } = useQuery({
  queryKey: ["product", barcode],
  queryFn: () => getProduct(barcode),
});

if (error) {
  console.log(error.message); // TypeScript knows it's Error
}
```

### Prefetching

```typescript
"use client";

import { useQueryClient } from "@tanstack/react-query";

export function HistoryItem({ item }: { item: SearchHistoryItem }) {
  const queryClient = useQueryClient();

  const prefetchProduct = () => {
    queryClient.prefetchQuery({
      queryKey: ["product", item.code],
      queryFn: () => getProduct(item.code),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <Link
      href={`/product/${item.code}`}
      onMouseEnter={prefetchProduct}
    >
      {item.product_name}
    </Link>
  );
}
```

## v5 Migration Notes

| v4 | v5 |
|----|-----|
| `cacheTime` | `gcTime` |
| `enabled: false` | `skipToken` |
| `suspense: true` | `useSuspenseQuery` |
| `isLoading` (first load) | `isPending` |
| `isFetching` (any fetch) | Still `isFetching` |

## Best Practices

```typescript
// ✅ Use stable query keys
queryKey: ["product", barcode]  // Array with primitives

// ✅ Keep queryFn pure
queryFn: () => getProduct(barcode)  // No side effects

// ✅ Set appropriate staleTime
staleTime: 60 * 1000  // Don't refetch too often

// ✅ Use select for data transformation
select: (data) => data.products.filter(p => p.active)

// ❌ NEVER mutate query data directly
data.products.push(newProduct)  // Bad!

// ❌ NEVER use object as query key without stable reference
queryKey: [{ barcode }]  // Creates new object each render
```

## Commands

```bash
# Install
pnpm add @tanstack/react-query

# DevTools (optional)
pnpm add @tanstack/react-query-devtools
```

## DevTools Setup

```typescript
// app/providers.tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```
