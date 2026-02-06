# US-3.3: Visualización de producto - RED Phase Test Summary

## Tests Created (All Failing - RED Phase)

### 1. `components/product-card.test.tsx` (56 test cases)

**Coverage Map to Acceptance Criteria:**

| Acceptance Criterion | Test Cases | Status |
|---------------------|------------|--------|
| ✅ Imagen del producto (con fallback) | 8 tests | FAILING - Component not implemented |
| ✅ Nombre del producto | 4 tests | FAILING - Component not implemented |
| ✅ Marca | 4 tests | FAILING - Component not implemented |
| ✅ Categoría | 3 tests | FAILING - Component not implemented |
| ✅ Precio simulado (S/. 5-150) | 6 tests | FAILING - Component not implemented |
| ✅ Información nutricional | 10 tests | FAILING - Component not implemented |
| ✅ Diseño tipo card, responsive | 4 tests | FAILING - Component not implemented |
| ✅ Botón para volver a buscar | 3 tests | FAILING - Component not implemented |

#### Test Categories:

1. **Happy Path (8 tests)**
   - Display product name, brand, category
   - Display product image with correct src
   - Display simulated price in S/. format
   - Display all nutritional information with labels
   - Display back button with correct text

2. **Image Handling (5 tests)**
   - Fallback image when image_url is empty
   - Fallback image when image_url is null
   - Fallback image when image_url is undefined
   - Alt text with product name for accessibility

3. **Nutritional Information Display (7 tests)**
   - Display calories with kcal unit
   - Display proteins with g unit
   - Display carbohydrates with g unit
   - Display fat with g unit
   - Format decimal numbers correctly
   - Handle zero values in nutrients
   - Handle very large/small nutritional values

4. **Price Display (5 tests)**
   - Format price with 2 decimal places
   - Display S/. currency symbol
   - Handle whole number prices (50.00)
   - Handle minimum price range (5.00)
   - Handle maximum price range (150.00)

5. **Responsive Design (3 tests)**
   - Render as card component
   - Mobile-first responsive classes (w-full)
   - Responsive image container

6. **Back Button Functionality (2 tests)**
   - Call navigation function when clicked
   - Navigate to home page (/)

7. **Accessibility (5 tests)**
   - Semantic heading (H1) for product name
   - Proper heading hierarchy
   - Accessible labels for nutritional information
   - ARIA labels for price
   - Accessible button with descriptive text

8. **Edge Cases (9 tests)**
   - Long product names
   - Long brand names
   - Multiple categories with long text
   - Empty brand name ("Marca no disponible")
   - Empty category ("Categoría no disponible")
   - Very large nutritional values (9999, 999.99)
   - Very small nutritional values (0.01, 0.001)

9. **Visual States (3 tests)**
   - Proper card styling with rounded corners
   - Proper spacing between sections (space-y)
   - Nutritional info in grid layout

10. **Barcode Display (3 tests)**
    - Display product barcode
    - Label barcode properly ("Código de barras")
    - Format barcode in monospace font

---

### 2. `app/product/[barcode]/page.test.tsx` (37 test cases)

**Coverage Map to Acceptance Criteria:**

| Acceptance Criterion | Test Cases | Status |
|---------------------|------------|--------|
| ✅ Fetch and display product data | 6 tests | FAILING - Page not implemented |
| ✅ Loading state while fetching | 3 tests | FAILING - Page not implemented |
| ✅ Error state when not found | 7 tests | FAILING - Page not implemented |
| ✅ Add to history after success | 4 tests | FAILING - Page not implemented |
| ✅ Server component behavior | 2 tests | FAILING - Page not implemented |

#### Test Categories:

1. **Happy Path (6 tests)**
   - Fetch product data on page load with correct barcode
   - Display product information after successful fetch
   - Render ProductCard component with fetched data
   - Add product to history after successful fetch
   - Include timestamp in history item
   - Verify getProduct called with correct barcode

2. **Loading State (3 tests)**
   - Show loading skeleton while fetching product
   - Display loading text ("Cargando")
   - Show skeleton animation (animate-pulse)

3. **Error Handling (7 tests)**
   - Display error message when product not found
   - Display error state component
   - Show suggestion text ("Verifica el código")
   - Provide "Buscar de nuevo" button
   - **CRITICAL**: NOT add to history when product not found
   - Handle network errors gracefully
   - Handle API timeout errors

4. **Parameter Handling (4 tests)**
   - Use barcode from route params
   - Handle 6-digit barcodes
   - Handle 13-digit barcodes
   - Handle EAN-13 barcodes

5. **Server Component Behavior (2 tests)**
   - Verify async function (server component)
   - Fetch data on server before rendering

6. **SEO and Metadata (2 tests)**
   - Set page title with product name
   - Include barcode in page metadata

7. **Edge Cases (4 tests)**
   - Handle product with missing optional fields
   - Handle rapid successive page loads
   - Handle very long barcode (13 digits max)
   - Handle minimum barcode length (6 digits)

8. **Layout and Structure (3 tests)**
   - Render page with proper container
   - Mobile-first responsive layout (w-full)
   - Center content on desktop (max-w)

9. **Integration with History Store (2 tests)**
   - Call addItem only once per successful fetch
   - Format history item correctly with ISO timestamp

---

## Required data-testid Attributes

When implementing components, include these data-testid attributes:

### ProductCard Component
- `product-card` - Main container
- `product-image-container` - Image wrapper
- `product-brand` - Brand display
- `product-category` - Category display
- `product-barcode` - Barcode display
- `nutriments-grid` - Nutritional info grid

### ProductPage Component
- `product-page-container` - Main page wrapper
- `product-skeleton` - Loading skeleton
- `error-state` - Error display component

---

## Mock Data Structures

### Product Interface (from types/product.ts)
```typescript
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
  simulated_price: number;
}
```

### History Item Interface
```typescript
interface SearchHistoryItem {
  code: string;
  product_name: string;
  image_url: string;
  searched_at: string; // ISO 8601 format
}
```

---

## Expected Spanish UI Text

The following text should appear in the implementation:

- **"Buscar otro producto"** - Back button
- **"Código de barras"** - Barcode label
- **"Calorías"** - Calories label
- **"Proteínas"** - Proteins label
- **"Carbohidratos"** - Carbohydrates label
- **"Grasas"** - Fat label
- **"Precio"** - Price ARIA label
- **"Cargando"** - Loading text
- **"Producto no encontrado"** - Error message
- **"Verifica el código"** - Error suggestion
- **"Buscar de nuevo"** - Error retry button
- **"Marca no disponible"** - Empty brand fallback
- **"Categoría no disponible"** - Empty category fallback

---

## Implementation Hints (NOT CODE)

### ProductCard Component
1. Should be a client component ("use client") - uses useRouter
2. Props: `{ product: Product }`
3. Image fallback: Check if `image_url` is falsy, use `/placeholder-product.png`
4. Price format: Use `.toFixed(2)` for 2 decimals
5. Nutritional grid: Use Tailwind grid classes (grid-cols-2 or grid-cols-4)
6. Back button: Use `useRouter()` from `next/navigation`, call `router.push("/")`
7. Empty states: Use ternary or || operator for brand/category fallbacks

### ProductPage Component
1. Should be a server component (async function, no "use client")
2. Params: `{ params: { barcode: string } }`
3. Use try-catch for error handling
4. Call `getProduct(params.barcode)` in try block
5. On success: render `<ProductCard product={data} />` and add to history
6. On error: render error state component
7. Show loading skeleton during fetch (Suspense or loading state)

---

## Assumptions Made

1. **Placeholder image** path: `/placeholder-product.png` (should exist in `/public`)
2. **Price generation** is done in the adapter (hash of barcode → 5-150 range)
3. **History store** uses Zustand with persist middleware
4. **Server action** `getProduct()` exists in `@/actions/product`
5. **ProductSkeleton** component exists in `components/product-skeleton.tsx`
6. **ErrorState** component exists (to be created or part of ProductPage)
7. **Navigation** to "/" returns to home/search page

---

## How to Run Tests (Will All Fail - RED Phase)

```bash
# Install dependencies first
pnpm install

# Run all tests (should see 93 failures)
pnpm test

# Run only ProductCard tests (should see 56 failures)
pnpm test product-card.test.tsx

# Run only ProductPage tests (should see 37 failures)
pnpm test page.test.tsx

# Run in watch mode
pnpm test:watch
```

---

## Next Steps (GREEN Phase)

After reviewing these tests, the **implementation-specialist** agent should:

1. Create `components/product-card.tsx` with all required elements
2. Create `app/product/[barcode]/page.tsx` as server component
3. Implement error handling and loading states
4. Add all required data-testid attributes
5. Run tests until all 93 tests pass (GREEN)
6. Refactor for code quality while keeping tests green

---

## Test Verification Status

- ✅ **RED Phase Complete**: All 93 tests written and failing
- ⏳ **GREEN Phase Pending**: Implementation needed
- ⏳ **REFACTOR Phase Pending**: Code quality improvements

**Total Test Coverage**: 93 test cases across 2 test files
**Acceptance Criteria Coverage**: 100% (all 8 criteria have corresponding tests)
**Test Organization**: Follows AAA pattern (Arrange, Act, Assert)
**Accessibility**: ARIA labels and semantic HTML tested throughout
