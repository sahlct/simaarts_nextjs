"use client";

import { useEffect, useRef, useState } from "react";
import { getProducts } from "@/lib/api/product";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/api/slugify";

export default function NewArrivals() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch only new products
  const loadNewArrivals = async () => {
    try {
      setLoading(true);
      const res = await getProducts(1, 10, "", { is_new: 1, status: 1 });
      setProducts(res.data || []);
    } catch (err) {
      console.error("New arrivals fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewArrivals();
  }, []);

  // Scroll Left
  const scrollLeft = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: -350 * 2,
      behavior: "smooth",
    });
  };

  // Scroll Right
  const scrollRight = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: 350 * 2,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-12 md:py-16 py-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Latest Additions To Our Collection</h2>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            className="hidden md:flex rounded-full bg-black text-white hover:bg-gray-800 cursor-pointer"
          >
            <ChevronLeft size={22} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            className="hidden md:flex rounded-full bg-black text-white hover:bg-gray-800 cursor-pointer"
          >
            <ChevronRight size={22} />
          </Button>
        </div>
      </div>

      {/* SLIDER */}
      <div
        ref={scrollRef}
        className="flex md:gap-10 gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
      >
        {/*  SKELETON LOADING */}
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[260px] max-w-[260px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
            >
              {/* IMAGE SKELETON */}
              <div className="h-64 bg-gray-200" />

              {/* TEXT SKELETON */}
              <div className="p-4 bg-[#FFF7EB] space-y-3">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-300 rounded w-1/2" />
              </div>
            </div>
          ))}

        {/*  REAL DATA */}
        {!loading &&
          products.map((p) => {
            const thumb = p.thumbnail_image
              ? base_url + p.thumbnail_image
              : "/placeholder.png";

            return (
              <div
                onClick={() => router.push(`/public/products/${slugify(p.product_name)}`)}
                key={p.product_name}
                className="min-w-[260px] max-w-[260px] hover:shadow-lg transition-all duration-300 hover:shadow-orange-200 cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="h-64 flex items-center justify-center bg-white">
                  <img
                    src={thumb}
                    alt={p.product_name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="p-4 bg-[#FFF7EB]">
                  <p className="text-lg font-semibold text-gray-900">
                    {p.product_code || p.product_name}
                  </p>

                  <p className="text-sm text-orange-500 mt-1">
                    {p.SubCategory?.sub_category_name || "—"}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
