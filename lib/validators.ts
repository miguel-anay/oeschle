const BARCODE_REGEX = /^\d{6,13}$/;

export function isValidBarcode(code: string): boolean {
  return BARCODE_REGEX.test(code);
}

export function getBarcodeError(code: string): string | null {
  if (!code) {
    return null;
  }

  if (!/^\d*$/.test(code)) {
    return "Solo se permiten números";
  }

  if (code.length < 6) {
    return "El código debe tener al menos 6 dígitos";
  }

  if (code.length > 13) {
    return "El código no puede tener más de 13 dígitos";
  }

  return null;
}
