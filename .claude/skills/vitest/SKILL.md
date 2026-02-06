---
name: vitest
description: >
  Vitest testing patterns for React and TypeScript.
  Trigger: When writing unit tests with Vitest, React Testing Library, or configuring test setup.
license: Apache-2.0
metadata:
  author: barcode-scanner
  version: "1.0"
  scope: [root]
  auto_invoke: "Writing Vitest tests"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

## When to Use

- Writing unit tests for React components
- Testing hooks, utilities, or server actions
- Configuring Vitest with React Testing Library
- Mocking modules, APIs, or browser APIs

## Critical Patterns

### Test Philosophy (REQUIRED)

```typescript
// ✅ Test behavior, not implementation
test("shows error when barcode is invalid", async () => {
  render(<BarcodeInput />);
  await userEvent.type(screen.getByRole("textbox"), "123");
  expect(screen.getByText(/at least 6 digits/i)).toBeInTheDocument();
});

// ❌ NEVER test implementation details
test("sets error state to true", () => {
  // Don't test internal state!
});
```

### AAA Pattern (Arrange, Act, Assert)

```typescript
test("adds product to history on successful search", async () => {
  // Arrange
  const product = { code: "123456", product_name: "Test" };
  vi.mocked(getProduct).mockResolvedValue(product);

  // Act
  render(<SearchPage />);
  await userEvent.type(screen.getByRole("textbox"), "123456");
  await userEvent.click(screen.getByRole("button", { name: /search/i }));

  // Assert
  expect(await screen.findByText("Test")).toBeInTheDocument();
});
```

### Component Testing

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";

describe("ProductCard", () => {
  test("displays product information", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText(mockProduct.product_name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.brands)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", mockProduct.image_url);
  });

  test("shows fallback image when image_url is missing", () => {
    render(<ProductCard product={{ ...mockProduct, image_url: "" }} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/placeholder.png");
  });
});
```

### Mocking Patterns

```typescript
// Mock modules
vi.mock("@/actions/product", () => ({
  getProduct: vi.fn(),
}));

// Mock fetch
vi.stubGlobal("fetch", vi.fn());

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// Spy on methods
const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
```

### Testing Hooks

```typescript
import { renderHook, act } from "@testing-library/react";

test("useHistoryStore adds items correctly", () => {
  const { result } = renderHook(() => useHistoryStore());

  act(() => {
    result.current.addItem({ code: "123", product_name: "Test", searched_at: new Date().toISOString() });
  });

  expect(result.current.items).toHaveLength(1);
  expect(result.current.items[0].code).toBe("123");
});
```

### Async Testing

```typescript
test("fetches and displays product", async () => {
  vi.mocked(getProduct).mockResolvedValue(mockProduct);

  render(<ProductPage params={{ barcode: "123456" }} />);

  // Wait for async content
  expect(await screen.findByText("Nutella")).toBeInTheDocument();
});

test("shows error when product not found", async () => {
  vi.mocked(getProduct).mockRejectedValue(new Error("Product not found"));

  render(<ProductPage params={{ barcode: "000000" }} />);

  expect(await screen.findByText(/not found/i)).toBeInTheDocument();
});
```

### Query Priority (Best Practice)

```typescript
// ✅ Priority order (most accessible first)
screen.getByRole("button", { name: /search/i });  // Best
screen.getByLabelText("Barcode");                  // Good
screen.getByPlaceholderText("Enter barcode");      // OK
screen.getByText("Search");                        // OK
screen.getByTestId("search-btn");                  // Last resort

// ❌ Avoid
screen.getByClassName("btn-primary");  // Not accessible
```

## Test Setup

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

```typescript
// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
```

## Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test src/components/product-card.test.tsx

# Run tests matching pattern
pnpm test -t "ProductCard"
```

## File Naming

```
components/
├── product-card.tsx
├── product-card.test.tsx    # Co-located test
hooks/
├── use-history.ts
├── use-history.test.ts
lib/
├── validators.ts
├── validators.test.ts
```
