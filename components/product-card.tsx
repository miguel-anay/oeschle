"use client";

import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

const PLACEHOLDER_IMAGE = "/placeholder-product.png";

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const imageUrl = product.image_url || PLACEHOLDER_IMAGE;
  const brandText = product.brands || "Marca no disponible";
  const categoryText = product.categories || "Categoría no disponible";
  const formattedPrice = product.simulated_price.toFixed(2);

  const handleBackClick = () => {
    router.push("/");
  };

  return (
    <div
      data-testid="product-card"
      className={cn(
        "w-full rounded-lg border bg-card text-card-foreground shadow-sm",
        "space-y-4 p-6"
      )}
    >
      {/* Product Image */}
      <div
        data-testid="product-image-container"
        className="relative w-full overflow-hidden rounded-lg"
      >
        <img
          src={imageUrl}
          alt={product.product_name}
          className="h-48 w-full object-contain"
        />
      </div>

      {/* Product Name */}
      <h1 className="text-2xl font-bold">{product.product_name}</h1>

      {/* Brand */}
      <p data-testid="product-brand" className="text-muted-foreground">
        {brandText}
      </p>

      {/* Category */}
      <p data-testid="product-category" className="text-sm text-muted-foreground">
        {categoryText}
      </p>

      {/* Price */}
      <p aria-label="Precio" className="text-xl font-semibold text-primary">
        S/. {formattedPrice}
      </p>

      {/* Barcode */}
      <div>
        <span className="text-sm text-muted-foreground">Código de barras: </span>
        <span data-testid="product-barcode" className="font-mono">
          {product.code}
        </span>
      </div>

      {/* Nutritional Information */}
      <div>
        <h2 className="mb-2 text-lg font-semibold">Información Nutricional</h2>
        <div
          data-testid="nutriments-grid"
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          <div aria-label="Calorías">
            <span className="block text-sm text-muted-foreground">Calorías</span>
            <span className="font-medium">
              {product.nutriments.energy_kcal_100g} kcal
            </span>
          </div>
          <div>
            <span className="block text-sm text-muted-foreground">Proteínas</span>
            <span className="font-medium">
              {product.nutriments.proteins_100g} g
            </span>
          </div>
          <div>
            <span className="block text-sm text-muted-foreground">Carbohidratos</span>
            <span className="font-medium">
              {product.nutriments.carbohydrates_100g} g
            </span>
          </div>
          <div>
            <span className="block text-sm text-muted-foreground">Grasas</span>
            <span className="font-medium">{product.nutriments.fat_100g} g</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <Button onClick={handleBackClick} className="w-full">
        Buscar otro producto
      </Button>
    </div>
  );
}
