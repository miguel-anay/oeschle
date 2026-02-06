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
