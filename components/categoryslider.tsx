"use client";

import { useEffect, useRef, useState } from "react";
import { getCategories } from "@/lib/api/category";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slugify";

interface Category {
  category_id: number;
  category_name: string;
  category_image: string;
}

export default function CategorySlider() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  /* ---------------- LOAD CATEGORIES ---------------- */
  const loadCategories = async () => {
    try {
      const res = await getCategories(1, 10, "", 1);
      setCategories(res?.data || []);
    } catch (err) {
      console.error("Category fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* ---------------- SCROLL ---------------- */
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -600, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 600, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-12 py-10">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Categories</h2>

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

      {/* ---------------- SLIDER ---------------- */}
      <div
        ref={scrollRef}
        className="flex md:gap-10 gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4 px-2"
      >
        {/* ---------- SKELETON ---------- */}
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[260px] max-w-[260px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
            >
              <div className="h-64 bg-gray-200" />
              <div className="p-4 bg-[#FFF7EB]">
                <div className="h-5 w-3/4 bg-gray-300 rounded" />
              </div>
            </div>
          ))}

        {/* ---------- REAL DATA ---------- */}
        {!loading &&
          categories.map((cat) => {
            const image = cat.category_image
              ? base_url + cat.category_image
              : "/placeholder.png";

            return (
              <div
                key={cat.category_id}
                onClick={() => router.push(`/public/products?category=${slugify(cat.category_name)}`)}
                className="min-w-[260px] hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 cursor-pointer max-w-[260px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* IMAGE */}
                <div className="h-64 flex items-center justify-center bg-white">
                  <img
                    src={image}
                    alt={cat.category_name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4 bg-[#FFF7EB]">
                  <p className="text-lg font-semibold text-gray-900">
                    {cat.category_name}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
