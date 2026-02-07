import { getProduct } from "@/actions/product";
import { ProductCard } from "@/components/product-card";
import { ProductSkeleton } from "@/components/product-skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
        className="mx-auto w-full max-w-2xl py-6 sm:py-8 lg:py-12"
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
        className="mx-auto w-full max-w-2xl py-6 sm:py-8 lg:py-12"
      >
        <div
          data-testid="error-state"
          className="flex flex-col items-center justify-center space-y-4 py-12"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
              <path d="M8 8h6" />
            </svg>
          </div>

          <p className="text-sm text-muted-foreground">Error</p>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Producto no encontrado
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Verifica el código e intenta de nuevo
          </p>

          <Link href="/">
            <Button className="min-h-[44px]">Buscar de nuevo</Button>
          </Link>
        </div>
      </main>
    );
  }
}
