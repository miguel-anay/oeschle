"use server";

import { adaptProduct } from "./product.adapter";
import type { Product, OpenFoodFactsResponse } from "@/types/product";

const API_BASE = "https://world.openfoodfacts.org/api/v0/product";

export async function getProduct(barcode: string): Promise<Product> {
  const response = await fetch(`${API_BASE}/${barcode}.json`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Error al conectar con el servidor");
  }

  const data: OpenFoodFactsResponse = await response.json();

  if (data.status !== 1 || !data.product) {
    throw new Error("Producto no encontrado");
  }

  return adaptProduct(data.product, barcode);
}
