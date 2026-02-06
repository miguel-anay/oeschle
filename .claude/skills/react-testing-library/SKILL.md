---
name: react-testing-library
description: >
  React Testing Library patterns for accessible, behavior-driven component testing.
  Trigger: When writing component tests with @testing-library/react (queries, userEvent, waitFor, within, custom render). For test runner config (vitest.config, mocking), also use vitest.
license: Apache-2.0
metadata:
  author: barcode-scanner
  version: "1.0"
  scope: [root]
  auto_invoke: "Writing React component tests with @testing-library/react"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

## When to Use

- Choosing the right query (getBy vs queryBy vs findBy)
- Testing user interactions (clicks, typing, form submissions)
- Testing async UI updates (loading states, API responses)
- Scoped queries with `within()`
- Custom render with providers (Router, Theme, Store)
- Asserting element presence/absence
- Testing accessible components

## Query Decision Tree (REQUIRED)

```
Element exists RIGHT NOW?
├── YES → getBy*
│   └── Need to assert ABSENCE later? → queryBy* (returns null)
└── NO (appears after async action)
    └── findBy* (waits + retries automatically)
```

| Scenario | Query | Why |
|----------|-------|-----|
| Element is in the DOM | `getBy*` | Throws if missing (instant feedback) |
| Assert element is NOT present | `queryBy*` | Returns `null` instead of throwing |
| Element appears after async | `findBy*` | Retries until found or timeout |
| Multiple elements expected | `getAllBy*` / `findAllBy*` | Returns array |
| Assert list is empty | `queryAllBy*` | Returns `[]` instead of throwing |

## Query Priority (REQUIRED)

Always pick the highest-priority query that works:

```typescript
// 1. ByRole — BEST (accessible to everyone)
screen.getByRole("button", { name: /search/i });
screen.getByRole("textbox", { name: /barcode/i });
screen.getByRole("heading", { level: 2 });
screen.getByRole("img", { name: /product/i });
screen.getByRole("link", { name: /history/i });

// 2. ByLabelText — form fields with labels
screen.getByLabelText("Barcode");
screen.getByLabelText(/email address/i);

// 3. ByPlaceholderText — input without visible label
screen.getByPlaceholderText("Ingresa codigo de barras...");

// 4. ByText — non-interactive elements
screen.getByText(/product not found/i);
screen.getByText("Nutella");

// 5. ByDisplayValue — filled input by current value
screen.getByDisplayValue("7501055363803");

// 6. ByAltText — images
screen.getByAltText("Nutella product image");

// 7. ByTitle — tooltip elements (rarely needed)
screen.getByTitle("Close");

// 8. ByTestId — LAST RESORT only
screen.getByTestId("barcode-scanner-preview");
```

## userEvent over fireEvent (REQUIRED)

```typescript
import userEvent from "@testing-library/user-event";

// ✅ ALWAYS: userEvent (simulates real user behavior)
const user = userEvent.setup();
await user.type(screen.getByRole("textbox"), "3017620422003");
await user.click(screen.getByRole("button", { name: /search/i }));
await user.clear(screen.getByRole("textbox"));
await user.keyboard("{Enter}");
await user.tab();

// ❌ NEVER: fireEvent (synthetic, skips real browser behavior)
fireEvent.change(input, { target: { value: "3017620422003" } });
fireEvent.click(button);
```

### userEvent.setup() Pattern

```typescript
// ✅ Setup once per test for consistent behavior
test("searches product on Enter", async () => {
  const user = userEvent.setup();
  render(<BarcodeInput />);

  await user.type(screen.getByRole("textbox"), "3017620422003");
  await user.keyboard("{Enter}");

  expect(await screen.findByText("Nutella")).toBeInTheDocument();
});
```

## Async Patterns

### findBy* (preferred for waiting on elements)

```typescript
// ✅ findBy = waitFor + getBy (cleaner, better errors)
test("shows product after fetch", async () => {
  render(<ProductPage barcode="3017620422003" />);
  expect(await screen.findByText("Nutella")).toBeInTheDocument();
});

// ❌ NEVER: waitFor wrapping getBy (redundant)
const el = await waitFor(() => screen.getByText("Nutella"));
```

### waitFor (for non-element assertions)

```typescript
import { waitFor } from "@testing-library/react";

// ✅ waitFor for non-DOM assertions
await waitFor(() => {
  expect(mockFetch).toHaveBeenCalledWith("/api/product/123456");
});

// ✅ Single assertion per waitFor
await waitFor(() => {
  expect(screen.getByText("Nutella")).toBeInTheDocument();
});
// Additional assertions AFTER waitFor
expect(screen.getByText("Ferrero")).toBeInTheDocument();

// ❌ NEVER: Side effects inside waitFor (callback runs multiple times!)
await waitFor(() => {
  fireEvent.click(button); // WRONG — fires on every retry
  expect(result).toBeInTheDocument();
});

// ❌ NEVER: Empty waitFor
await waitFor(() => {});

// ❌ NEVER: Multiple assertions inside waitFor
await waitFor(() => {
  expect(screen.getByText("A")).toBeInTheDocument();
  expect(screen.getByText("B")).toBeInTheDocument(); // May never run
});
```

## within() — Scoped Queries

```typescript
import { within } from "@testing-library/react";

test("history item shows correct product info", () => {
  render(<HistoryList items={mockItems} />);

  const firstItem = screen.getAllByRole("listitem")[0];
  expect(within(firstItem).getByText("Nutella")).toBeInTheDocument();
  expect(within(firstItem).getByText("Ferrero")).toBeInTheDocument();
});

test("product card has correct actions", () => {
  render(<ProductCard product={mockProduct} />);

  const card = screen.getByRole("article");
  expect(within(card).getByRole("img")).toHaveAttribute("alt");
  expect(within(card).getByRole("link", { name: /back/i })).toBeInTheDocument();
});
```

## Asserting Absence

```typescript
// ✅ queryBy returns null — use for "not present"
expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
expect(screen.queryByRole("alert")).not.toBeInTheDocument();

// ✅ waitForElementToBeRemoved — element disappears after async
import { waitForElementToBeRemoved } from "@testing-library/react";

test("loading skeleton disappears after fetch", async () => {
  render(<ProductPage barcode="3017620422003" />);
  expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  await waitForElementToBeRemoved(() => screen.queryByTestId("skeleton"));
  expect(screen.getByText("Nutella")).toBeInTheDocument();
});

// ❌ NEVER: getBy to assert absence (throws before assertion runs)
expect(screen.getByText("Loading...")).not.toBeInTheDocument();
```

## Custom Render with Providers

```typescript
// test-utils.tsx
import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";

interface WrapperProps {
  children: React.ReactNode;
}

function AllProviders({ children }: WrapperProps) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };
```

```typescript
// Usage in tests
import { render, screen } from "@/test-utils";

test("works with providers", () => {
  render(<ProductCard product={mockProduct} />);
  expect(screen.getByText("Nutella")).toBeInTheDocument();
});
```

## Always Use screen (REQUIRED)

```typescript
// ✅ ALWAYS: Use screen object
render(<BarcodeInput />);
screen.getByRole("textbox");

// ❌ NEVER: Destructure from render
const { getByRole } = render(<BarcodeInput />);
getByRole("textbox");
```

## Use Proper jest-dom Matchers (REQUIRED)

```typescript
// ✅ Semantic matchers (clear intent + better error messages)
expect(button).toBeDisabled();
expect(input).toHaveValue("123456");
expect(element).toBeVisible();
expect(element).toHaveTextContent(/nutella/i);
expect(link).toHaveAttribute("href", "/product/123");
expect(input).toBeRequired();
expect(element).toHaveClass("active");

// ❌ NEVER: Raw property checks
expect(button.disabled).toBe(true);
expect(input.value).toBe("123456");
expect(element.textContent).toContain("nutella");
```

## Form Testing

```typescript
test("validates barcode and submits", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<BarcodeInput onSubmit={onSubmit} />);

  const input = screen.getByRole("textbox", { name: /barcode/i });
  const button = screen.getByRole("button", { name: /search/i });

  // Invalid input — button disabled
  await user.type(input, "123");
  expect(button).toBeDisabled();
  expect(screen.getByText(/at least 6 digits/i)).toBeInTheDocument();

  // Clear and type valid input
  await user.clear(input);
  await user.type(input, "3017620422003");
  expect(button).toBeEnabled();
  expect(screen.queryByText(/at least 6 digits/i)).not.toBeInTheDocument();

  // Submit
  await user.click(button);
  expect(onSubmit).toHaveBeenCalledWith("3017620422003");
});
```

## Common Mistakes Checklist

| Mistake | Fix |
|---------|-----|
| `const { getByRole } = render(...)` | `render(...); screen.getByRole(...)` |
| `fireEvent.click(btn)` | `await user.click(btn)` |
| `await waitFor(() => screen.getByText(...))` | `await screen.findByText(...)` |
| `expect(screen.queryByText("X")).toBeInTheDocument()` | `expect(screen.getByText("X")).toBeInTheDocument()` |
| `expect(btn.disabled).toBe(true)` | `expect(btn).toBeDisabled()` |
| Side effects inside `waitFor` | Move side effects before `waitFor` |
| `await waitFor(() => {})` | Put assertion inside callback |
| `getByText` for element absence | `queryByText` + `.not.toBeInTheDocument()` |
| Manual `act()` wrapping render | Remove it — `render` handles `act` |
| `afterEach(cleanup)` | Remove it — cleanup is automatic |
| `screen.getByTestId("submit")` | `screen.getByRole("button", { name: /submit/i })` |
| Multiple assertions in `waitFor` | Single assertion; rest outside |

## Resources

- [Queries - Testing Library docs](https://testing-library.com/docs/queries/about/)
- [Common Mistakes - Kent C. Dodds](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details)
- [Avoid Nesting When Testing](https://kentcdodds.com/blog/avoid-nesting-when-youre-testing)
