# TDD Specialist - Project Memory

## Test Patterns for Barcode Scanner App

### Validation Error Messages (US-2.2)
- Error messages come from `lib/validators.ts` via `getBarcodeError()` function
- Expected error messages:
  - Too short: "El código debe tener al menos 6 dígitos"
  - Too long: "El código no puede tener más de 13 dígitos"
  - Non-numeric: "Solo se permiten números"
- Error text should have `text-destructive` class
- Error messages are `<p>` elements below the input

### Error State Testing Patterns
- Use `screen.getByText()` when error MUST be present
- Use `screen.queryByText()` when checking error is NOT present
- Always test error styling with `.toHaveClass("border-destructive")`
- Test error clearing by typing correction and checking with `queryByText()`

### Component Testing Structure
1. Happy Path - successful scenarios
2. Edge Cases - boundaries and limits
3. Input Filtering - character validation
4. Mobile-First Design - responsive classes
5. User Interactions - events and callbacks
6. **Validation Feedback** - error messages and styling (US-2.2)

### Common Mocking Patterns
```typescript
const onSearch = vi.fn();
const user = userEvent.setup();
```

### Test Coverage Checklist for Validation
- [ ] Error shows for invalid input
- [ ] Error styling applied (border-destructive)
- [ ] Error hidden when input valid
- [ ] Error hidden when input empty
- [ ] Error clears when corrected
- [ ] Helper text displayed properly
- [ ] Error text has correct styling

## Camera Scanner Testing (US-2.3)

### html5-qrcode Mocking Pattern
```typescript
const mockStart = vi.fn();
const mockStop = vi.fn();
const mockClear = vi.fn();
const mockIsScanning = vi.fn();

vi.mock('html5-qrcode', () => ({
  Html5Qrcode: vi.fn().mockImplementation(() => ({
    start: mockStart,
    stop: mockStop,
    clear: mockClear,
    isScanning: mockIsScanning.mockReturnValue(false),
  })),
  Html5QrcodeSupportedFormats: {
    EAN_13: 0,
    EAN_8: 1,
    UPC_A: 2,
    UPC_E: 3,
    QR_CODE: 10,
  },
}));
```

### Async Scanner Testing Patterns
- Use `waitFor()` for state transitions after camera start/stop
- Mock `start()` to capture success callback for simulating barcode detection
- Use `mockIsScanning()` to control state between active/inactive
- Always test cleanup on unmount (critical for camera resources)

### Camera Scanner Test Categories
1. **Happy Path** - button states, preview visibility, scan callback
2. **Error States** - permission denied, camera errors, missing onError
3. **Loading States** - initialization, prevent multiple starts
4. **Lifecycle** - unmount cleanup, multiple start/stop cycles
5. **Accessibility** - button labels, ARIA attributes
6. **Styling** - primary button, aspect-video container
7. **Edge Cases** - empty barcode, rapid cycles, null refs
8. **User Interactions** - toggle, keyboard navigation

### Expected Spanish Text
- "Activar cámara" - Start camera button
- "Cerrar cámara" - Stop camera button

### Scanner Configuration Testing
Must verify `start()` called with:
- Camera: `{ facingMode: 'environment' }` (back camera)
- Config: `fps: 10`, `qrbox: { width: 250, height: 150 }`
- Formats: Array containing EAN-13, EAN-8, UPC-A, UPC-E, QR codes

### Critical Test Cases
- Camera stops automatically after successful scan
- Cleanup called on unmount (stop + clear)
- Button disabled during initialization
- No multiple simultaneous start attempts
- onError optional (component works without it)

## Product Search Testing (US-3.1)

### OpenFoodFacts API Testing
- **Endpoint**: `https://world.openfoodfacts.org/api/v0/product/{barcode}.json`
- **Success Response**: `{ status: 1, product: {...} }`
- **Not Found Response**: `{ status: 0, status_verbose: "product not found" }`

### Server Actions Testing Pattern
```typescript
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Always verify URL construction
expect(mockFetch).toHaveBeenCalledWith(
  `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
);
```

### API Field Name Transformation
- **API Format**: `energy-kcal_100g` (hyphenated)
- **App Format**: `energy_kcal_100g` (underscored)
- Adapter must transform nutriment field names

### Product Adapter Testing
1. **Complete data** → Full transformation
2. **Missing fields** → Defaults (empty string for text, 0 for numbers)
3. **Null/undefined** → Handle with defaults
4. **Empty object** → All default values
5. **Partial nutriments** → Mix of real + default values

### Test Organization for Server Actions
1. **Happy Path** - Valid barcodes (6-digit, 13-digit, real products)
2. **Error States** - Product not found (status: 0), network errors (500, 404, timeout)
3. **Edge Cases** - Empty product data, malformed JSON, URL construction
4. **API Integration** - Verify fetch calls, headers

### Expected Error Messages
- Product not found: "Product not found" (thrown error)
- Network errors: Propagate original error message

### Test Files Created
- `actions/product.test.ts` - 15 test cases for getProduct()
- `actions/product.adapter.test.ts` - 13 test cases for adaptProduct()

## Loading Skeleton Testing (US-3.2)

### Skeleton/Loading Component Testing Pattern
- Always test for `aria-busy="true"` and `role="status"` for accessibility
- Verify `aria-label` describes the loading state clearly
- Use `aria-live="polite"` for non-intrusive screen reader updates
- Test data-testid attributes for each skeleton element (image, name, details)
- Verify Tailwind classes directly with `toHaveClass()` matcher
- Test animation classes (e.g., `animate-pulse`) separately
- Verify no actual content is rendered (empty text content)
- Test visual consistency with actual component layout

### ProductSkeleton Component Structure
- Container: `data-testid="product-skeleton"`, `role="status"`, `aria-busy="true"`, `aria-live="polite"`, `aria-label="Loading product information"`
- Image placeholder: `data-testid="skeleton-image"`, `h-48`, `bg-slate-200`, `rounded-lg`
- Name placeholder: `data-testid="skeleton-name"`, `h-6`, `w-3/4`, `bg-slate-200`, `rounded`
- Details placeholder: `data-testid="skeleton-details"`, `h-4`, `w-1/2`, `bg-slate-200`, `rounded`
- Container classes: `animate-pulse`, `space-y-4`

### Test Categories for Loading Components
1. **Happy Path** - Basic rendering of skeleton structure
2. **Animation** - Verify loading animation classes
3. **Skeleton Elements Layout** - Dimensions and spacing
4. **Styling** - Colors, borders, consistent theming
5. **Accessibility** - ARIA attributes, roles, labels
6. **Edge Cases** - Consistency across renders, no data leakage
7. **Visual Consistency** - Match actual component layout

### Test Files Created
- `components/product-skeleton.test.tsx` - 23 test cases covering structure, animation, layout, styling, accessibility, edge cases

## Product Display Testing (US-3.3)

### ProductCard Component Testing Pattern
- **Image Fallback**: Test empty string, null, and undefined for `image_url`
  - Fallback: `/placeholder-product.png`
  - Always verify alt text includes product name for accessibility
- **Price Display**: Format "S/. XX.XX" (always 2 decimals, range 5-150)
- **Nutritional Info**: Test complete display with units (kcal, g)
  - Format: "539 kcal", "6.3 g"
  - Test decimal precision (0.001, 999.99)
  - Test zero values explicitly
- **Text Overflow**: Test long product names, brands, and categories
- **Empty Fields**: Spanish text for missing data
  - Brand: "Marca no disponible"
  - Category: "Categoría no disponible"

### ProductCard Test Organization
1. **Happy Path** - All acceptance criteria (name, brand, category, image, price, nutrients, back button)
2. **Image Handling** - Fallback for empty/""/null/undefined, alt text
3. **Nutritional Information Display** - All nutriments + units, decimal formatting, zero values, extreme values
4. **Price Display** - Currency formatting, decimals, boundaries (5.00, 150.00)
5. **Responsive Design** - Mobile-first classes (w-full), card styling
6. **Back Button Functionality** - Navigation to "/" via useRouter
7. **Accessibility** - H1 heading, ARIA labels, semantic HTML
8. **Edge Cases** - Long text, empty brand/category, large/small nutriment values
9. **Visual States** - Card styling, spacing, grid layout
10. **Barcode Display** - Monospace font, proper labeling

### ProductCard Data-testid Attributes
- `product-card` - Main container
- `product-image-container` - Image wrapper
- `product-brand` - Brand display (handles empty state)
- `product-category` - Category display (handles empty state)
- `product-barcode` - Barcode display with monospace
- `nutriments-grid` - Nutritional info grid layout

### ProductPage (Server Component) Testing Pattern
- Mock `getProduct` server action
- Mock `useHistoryStore` Zustand store
- Mock `next/navigation` router
- Test async behavior with `await ProductPage()` and `waitFor()`
- **CRITICAL**: Verify history NOT saved on error (product not found should NOT call addItem)

### ProductPage Test Organization
1. **Happy Path** - Fetch product, render ProductCard, add to history with timestamp
2. **Loading State** - Show skeleton with animation while fetching
3. **Error Handling** - Product not found, network errors, NO history save on error
4. **Parameter Handling** - Different barcode lengths (6-13 digits)
5. **Server Component Behavior** - Async function, server-side fetch
6. **SEO and Metadata** - Page title with product name + barcode
7. **Edge Cases** - Missing fields, rapid page loads, boundary barcode lengths
8. **Layout and Structure** - Mobile-first container, centered desktop layout
9. **Integration with History Store** - Single addItem call, correct timestamp format (ISO 8601)

### ProductPage Data-testid Attributes
- `product-page-container` - Main page wrapper
- `product-skeleton` - Loading state
- `error-state` - Error display

### Mock Product Test Data Patterns
```typescript
// Standard - Full valid product
const mockProduct: Product = {
  code: "3017620422003",
  product_name: "Nutella",
  brands: "Ferrero",
  image_url: "https://example.com/nutella.jpg",
  categories: "Spreads, Sweet spreads",
  nutriments: { energy_kcal_100g: 539, proteins_100g: 6.3, carbohydrates_100g: 57.5, fat_100g: 30.9 },
  simulated_price: 45.99,
};

// Without Image
const mockProductWithoutImage = { ...mockProduct, image_url: "" };

// Long Text - Test text overflow handling
const mockProductLongText = {
  ...mockProduct,
  product_name: "Very Long Product Name That Should Be Truncated Or Wrapped...",
  brands: "Very Long Brand Name...",
  categories: "Cat1, Cat2, Cat3, Cat4, Cat5, Cat6",
};

// Edge Nutritional Values
const productLargeValues = { nutriments: { energy_kcal_100g: 9999, proteins_100g: 999.99, ... } };
const productSmallValues = { nutriments: { energy_kcal_100g: 0.01, proteins_100g: 0.001, ... } };
```

### Common Mocks for Product Display
```typescript
// Server action
vi.mock("@/actions/product", () => ({
  getProduct: vi.fn(),
}));

// Zustand store
vi.mock("@/store/history", () => ({
  useHistoryStore: vi.fn(() => ({
    items: [],
    addItem: vi.fn(),
    clearHistory: vi.fn(),
  })),
}));

// Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));
```

### Expected Spanish UI Text
- "Buscar otro producto" - Back button
- "Código de barras" - Barcode label
- "Calorías", "Proteínas", "Carbohidratos", "Grasas" - Nutriment labels
- "Precio" - Price ARIA label
- "Cargando" - Loading text
- "Producto no encontrado" - Error message
- "Verifica el código" - Error suggestion
- "Buscar de nuevo" - Error retry button

### Test Files Created
- `components/product-card.test.tsx` - 56 test cases covering display, image handling, price, nutrients, accessibility, edge cases
- `app/product/[barcode]/page.test.tsx` - 37 test cases covering server component, loading, errors, history integration, SEO

## Error State Testing (US-3.4)

### ErrorState Component Testing Pattern
- **Spanish UI Text**: Test exact Spanish phrases
  - Default title: "Producto no encontrado"
  - Default message: "Verifica el código e intenta de nuevo"
  - Retry button: "Buscar de nuevo" OR "Volver a buscar"
- **Props Interface**: `{ title?: string; message?: string; onRetry?: () => void }`
- **Default Behavior**: Shows defaults when props undefined/not provided
- **Optional Callbacks**: Component handles undefined/null onRetry gracefully
- **data-testid attributes**: `error-state`, `error-icon`

### ErrorState Test Organization
1. **Happy Path** - Default title/message/button/icon display
2. **Custom Content** - Props override defaults correctly, partial overrides
3. **Retry Button Interaction** - Callback firing, multiple clicks, keyboard (Enter/Space)
4. **Icon and Visual Elements** - Icon presence, styling, positioning above title
5. **Accessibility** - role="alert", heading, button labeling, keyboard navigation
6. **Responsive Design** - Mobile-first classes, centering, full-width button
7. **Styling and Theme** - Error theme, typography, spacing, consistent gap
8. **Edge Cases** - Empty strings, long text, rapid clicks, null callbacks
9. **Component Structure** - DOM element order (icon → title → message → button)
10. **Text Content Validation** - Exact Spanish phrases, no English text

### DOM Order Verification Pattern
```typescript
const { container } = render(<ErrorState />);
const html = container.innerHTML;
expect(html.indexOf('error-icon')).toBeLessThan(html.indexOf('Producto no encontrado'));
expect(html.indexOf('Producto no encontrado')).toBeLessThan(html.indexOf('Verifica el código'));
```

### Accessibility Requirements for Error Components
- **role="alert"** - Container must be alert region for screen readers
- **role="heading"** - Title must be proper heading
- **Accessible button name** - Test with `getByRole('button', { name: /pattern/i })`
- **Keyboard navigation** - Test Enter and Space key activation
- **Focus management** - Button should be focusable
- **Screen reader text** - Message text should be descriptive

### Mobile-First Class Testing
```typescript
// Test for presence, not exact match
expect(element).toHaveClass(/(flex|grid|space-y|p-|py-|px-)/);
expect(element).toHaveClass(/(text-center|items-center|justify-center)/);
expect(button).toHaveClass(/w-full|sm:/); // Full width on mobile
```

### Optional Callback Handling Pattern
```typescript
// Test component works without callback
render(<ErrorState />);
await user.click(button);
// Should not throw

// Test callback when provided
const onRetry = vi.fn();
render(<ErrorState onRetry={onRetry} />);
await user.click(button);
expect(onRetry).toHaveBeenCalledTimes(1);
```

### Edge Cases for Error Components
- Empty string props: `title=""`, `message=""`
- Very long Spanish text (>100 chars) - should wrap gracefully
- Rapid successive clicks: `userEvent.tripleClick(button)`
- Null vs undefined: `onRetry={null as unknown as undefined}`
- All props undefined: `title={undefined} message={undefined} onRetry={undefined}`

### Spanish Text Validation Checklist
- [ ] "Producto no encontrado" - exact default title
- [ ] "Verifica el código e intenta de nuevo" - exact default message
- [ ] Button text matches pattern: `/buscar de nuevo|volver a buscar/i`
- [ ] No English text present by default
- [ ] Custom Spanish text displays correctly

### Test Files Created
- `components/error-state.test.tsx` - 94 test cases covering all acceptance criteria for US-3.4
