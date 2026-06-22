import { Suspense } from "react";
import ProductsClient from "@/components/productClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse ELBANO's premium collection of roofing tiles, shingles, rain gutters, and ceramic tiles. Imported from Italy, Spain, Japan, Brazil, and more — crafted for Kerala's climate.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Our Products | ELBANO",
    description: "Browse ELBANO's premium collection of roofing tiles, shingles, rain gutters, and ceramic tiles from across the globe.",
    url: "https://elbanoindia.com/products",
  },
}

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
