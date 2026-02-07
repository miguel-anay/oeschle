import { ProductSkeleton } from "@/components/product-skeleton";

export default function ProductLoading() {
  return (
    <main className="mx-auto w-full max-w-2xl py-6 sm:py-8 lg:py-12">
      <ProductSkeleton />
    </main>
  );
}
