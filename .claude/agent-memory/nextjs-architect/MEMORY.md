# Next.js Architect Memory

## Barcode Scanner App Architecture

### Scope Rule Application

**Shared (2+ places):**
- `components/barcode-input.tsx` - home + potentially header
- `components/product-card.tsx` - product page + history preview
- `components/product-skeleton.tsx` - multiple loading states
- `components/history-item.tsx` - history page + home preview
- `components/error-state.tsx` - multiple error scenarios
- `components/empty-state.tsx` - empty history + no results
- `lib/validators.ts` - barcode-input + server action
- `lib/price-generator.ts` - adapter + display
- `types/product.ts` - actions, components, store

**Local (1 place):**
- Route-specific loading/error files stay in their route folders

### Key Decisions

1. **Server Actions over API Routes** - Using `actions/` directory for data fetching
2. **Adapter Pattern** - `product.adapter.ts` transforms OpenFoodFacts API to domain types
3. **Zustand with Persist** - History stored in localStorage via persist middleware
4. **shadcn/ui Components** - button, input, card, skeleton, toast, dialog

### Patterns Established

- `app/product/[barcode]/` - Dynamic route for product display
- `store/history.ts` - Single store file with persist middleware
- `types/product.ts` - Centralized type definitions
- `lib/utils.ts` - cn() utility for class merging

### Dependencies

Core: next@15, react@19, zustand@5, tailwindcss@4
UI: shadcn/ui (new-york style), lucide-react
Bonus: html5-qrcode for camera scanner

### Links

- [Detailed Architecture](./architecture-design.md)
