/**
 * Generates a simulated price based on the barcode hash.
 * Returns a price between S/. 5 and S/. 150
 */
export function generateSimulatedPrice(barcode: string): number {
  let hash = 0;
  for (let i = 0; i < barcode.length; i++) {
    const char = barcode.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  const normalized = Math.abs(hash) % 14501;
  const price = 5 + normalized / 100;

  return Math.round(price * 100) / 100;
}

export function formatPrice(price: number): string {
  return `S/. ${price.toFixed(2)}`;
}
