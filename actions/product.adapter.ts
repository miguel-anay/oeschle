import type { Product, OpenFoodFactsResponse } from "@/types/product";
import { generateSimulatedPrice } from "@/lib/price-generator";

type OpenFoodFactsProduct = NonNullable<OpenFoodFactsResponse["product"]>;

export function adaptProduct(raw: OpenFoodFactsProduct, barcode: string): Product {
  return {
    code: raw.code || barcode,
    product_name: raw.product_name || "Producto sin nombre",
    brands: raw.brands || "Marca desconocida",
    image_url: raw.image_url || "",
    categories: raw.categories || "Sin categoría",
    nutriments: {
      energy_kcal_100g: raw.nutriments?.["energy-kcal_100g"] || 0,
      proteins_100g: raw.nutriments?.proteins_100g || 0,
      carbohydrates_100g: raw.nutriments?.carbohydrates_100g || 0,
      fat_100g: raw.nutriments?.fat_100g || 0,
    },
    simulated_price: generateSimulatedPrice(barcode),
  };
}
