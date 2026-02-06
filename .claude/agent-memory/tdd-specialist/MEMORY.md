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
