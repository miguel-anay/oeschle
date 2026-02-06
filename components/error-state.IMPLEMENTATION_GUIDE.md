# ErrorState Component - Implementation Guide

## File Location
`c:\oeschle\components\error-state.tsx`

## Component Specification

### Props Interface
```typescript
interface ErrorStateProps {
  title?: string;           // Default: "Producto no encontrado"
  message?: string;         // Default: "Verifica el código e intenta de nuevo"
  onRetry?: () => void;     // Optional callback for retry button
}
```

### Required Data-testid Attributes
- `data-testid="error-state"` - Main container
- `data-testid="error-icon"` - Icon/illustration element

### DOM Structure Order
1. Icon/illustration (search or empty state icon)
2. Title heading (h1 or h2)
3. Message paragraph
4. Retry button

### Default Spanish Text
- Title: "Producto no encontrado"
- Message: "Verifica el código e intenta de nuevo"
- Button: "Buscar de nuevo" or "Volver a buscar"

### Accessibility Requirements
- Container: `role="alert"` or fallback to data-testid
- Title: Must be a heading element (`<h1>` or `<h2>`) with proper role
- Button: Must have accessible name, support keyboard (Enter/Space)
- Include ARIA labels where appropriate

### Styling Requirements (Mobile-First)

#### Container
- Layout: Flexbox or Grid with vertical stacking
- Spacing: Consistent gap between elements (`space-y-4` or similar)
- Alignment: Centered text and content
- Padding: Responsive padding (`p-4`, `py-6`, etc.)

#### Icon
- Size: Large enough to be visible (`w-16 h-16` or similar)
- Color: Muted/secondary color (`text-slate-400` or similar)
- Position: Above title, centered

#### Title
- Typography: Large, bold heading (`text-2xl font-bold` or similar)
- Color: Dark text for contrast

#### Message
- Typography: Regular text with good readability
- Color: Muted text color (`text-slate-600` or similar)

#### Button
- Full width on mobile: `w-full sm:w-auto`
- Primary button styling: background, padding, rounded corners
- Hover state: Visual feedback
- Focus state: Visible focus ring for accessibility

### Behavior Requirements

1. **Default Props**: Show default Spanish text when props not provided
2. **Custom Props**: Override defaults when title/message provided
3. **Optional Callback**: Handle undefined/null onRetry gracefully (don't crash)
4. **Keyboard Support**: Button works with Enter and Space keys (native button behavior)
5. **Multiple Clicks**: Support rapid successive clicks without breaking

### Example Usage

```typescript
// Default error state
<ErrorState />

// Custom title
<ErrorState title="Error de búsqueda" />

// With retry callback
<ErrorState onRetry={() => router.push('/')} />

// Custom title, message, and callback
<ErrorState
  title="Código inválido"
  message="El código debe tener entre 6 y 13 dígitos"
  onRetry={handleRetry}
/>
```

### Implementation Hints

1. **Icon**: Use Lucide React icons (`Search`, `AlertCircle`, or `FileSearch`)
2. **Styling**: Use Tailwind classes, leverage `cn()` utility from `lib/utils.ts`
3. **Button**: Use shadcn/ui Button component if available
4. **Default Values**: Use nullish coalescing (`??`) or default parameters
5. **Layout**: Consider `flex flex-col items-center text-center gap-4 p-6`

### Test File Location
`c:\oeschle\components\error-state.test.tsx` (94 test cases)

### User Story Reference
**US-3.4**: Estado de error (Producto no encontrado)
- See `PROJECT_SPECS.md` for full acceptance criteria

## Implementation Checklist

Before marking as complete, verify:
- [ ] All 94 tests pass
- [ ] TypeScript compiles without errors
- [ ] Default Spanish text matches exactly
- [ ] Custom props override defaults correctly
- [ ] onRetry callback works when provided
- [ ] Component works without onRetry (no crash)
- [ ] Icon displays properly
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessibility: role="alert", heading, keyboard navigation
- [ ] Styling matches project theme
- [ ] No console errors or warnings
