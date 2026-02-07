import { getProduct } from "@/actions/product";
import { ProductCard } from "@/components/product-card";
import { ErrorState, ERROR_VARIANT } from "@/components/error-state";
import { HistoryUpdater } from "./history-updater";
import { TitleUpdater } from "./title-updater";

interface ProductPageProps {
  params: { barcode: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { barcode } = params;

  try {
    const product = await getProduct(barcode);

    return (
      <main
        data-testid="product-page-container"
        className="mx-auto w-full max-w-2xl animate-fadeIn py-6 sm:py-8 lg:py-12"
      >
        <TitleUpdater title={`${product.product_name} - ${barcode}`} />
        <HistoryUpdater
          code={product.code}
          product_name={product.product_name}
          image_url={product.image_url}
        />
        <ProductCard product={product} />
      </main>
    );
  } catch {
    return (
      <main
        data-testid="product-page-container"
        className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-2xl items-center justify-center py-6 sm:min-h-[calc(100vh-4rem)] sm:py-8 lg:py-12"
      >
        <ErrorState
          title="Producto no encontrado"
          message="Verifica el codigo e intenta de nuevo"
          variant={ERROR_VARIANT.NOT_FOUND}
          retryHref="/"
          retryLabel="Buscar de nuevo"
        />
      </main>
    );
  }
}
