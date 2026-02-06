import Link from "next/link";
import { getProduct } from "@/actions/product";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ barcode: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { barcode } = await params;

  try {
    const product = await getProduct(barcode);

    return (
      <main className="flex min-h-screen flex-col items-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            ← Volver a buscar
          </Link>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.product_name}
                className="mx-auto mb-4 h-48 w-48 rounded-lg object-contain"
              />
            )}

            <h1 className="text-xl font-bold">{product.product_name}</h1>
            <p className="text-muted-foreground">{product.brands}</p>
            <p className="text-sm text-muted-foreground">{product.categories}</p>

            <div className="mt-4 text-2xl font-bold text-primary">
              S/. {product.simulated_price.toFixed(2)}
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <h3 className="font-semibold">Información nutricional (por 100g)</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>Calorías: {product.nutriments.energy_kcal_100g} kcal</div>
                <div>Proteínas: {product.nutriments.proteins_100g}g</div>
                <div>Carbohidratos: {product.nutriments.carbohydrates_100g}g</div>
                <div>Grasas: {product.nutriments.fat_100g}g</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
