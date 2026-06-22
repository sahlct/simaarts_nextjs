import { Suspense } from "react";
import ProductsClient from "@/components/productClient";

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsClient />
    </Suspense>
  );
}

/* Optional skeleton */
function ProductsSkeleton() {
  return (
    <div className="py-16 text-center text-gray-400">
      Loading products...
    </div>
  );
}
