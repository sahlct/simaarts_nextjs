"use client";

import { useEffect, useState } from "react";
import { getCategoriesWithSubCategoriesAndProductCount } from "@/lib/api/category";
import { ArrowRight, Layers } from "lucide-react";
import { slugify } from "@/lib/slugify";
import Link from "next/link";

export default function CategorySlider() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategoriesWithSubCategoriesAndProductCount();
        if (res?.data) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Category fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="h-10 w-48 bg-[#EAE4D3] rounded-full animate-pulse mb-8 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 bg-white rounded-3xl animate-pulse border border-[#EAE4D3]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-[#FAF8F3] border-y border-[#EAE4D3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#D5C58A]/30 text-[#4A4229] text-[10px] md:text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4 border border-[#D5C58A]/50">
            <Layers size={14} className="text-[#8C7E4F]" />
            SimaArts Collections
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#2C271D] tracking-tight mb-4">
            Explore Scout & Guide Categories
          </h2>
          <p className="text-[#6E6454] text-sm md:text-base font-medium leading-relaxed">
            Discover our high-precision embroidered badges, certified uniforms, scarves, belts, and official accessories built for quality and heritage.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const catImage = cat.category_image
              ? cat.category_image.startsWith("http")
                ? cat.category_image
                : `${base_url}${cat.category_image}`
              : "/placeholder.png";

            return (
              <div
                key={cat.category_id}
                className="group bg-white rounded-[2rem] border border-[#EAE4D3] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between"
              >
                {/* Image & Overlay */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#FAF8F3]">
                  <img
                    src={catImage}
                    alt={cat.category_name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C271D]/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Badge count */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#2C271D] text-[10px] font-black px-3.5 py-1.5 rounded-full shadow-sm border border-[#D5C58A]/40 uppercase tracking-wider">
                    {cat.SubCategories?.length || 0} Subcategories
                  </div>

                  <div className="absolute bottom-4 left-6 right-6 text-white">
                    <h3 className="text-xl font-black tracking-tight text-white mb-0.5">
                      {cat.category_name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <p className="text-[#6E6454] text-xs leading-relaxed font-medium mb-6 line-clamp-2">
                    {cat.description ||
                      `Explore premium ${cat.category_name.toLowerCase()} manufactured according to official Scout & Guide specifications.`}
                  </p>

                  {/* Subcategories Pills */}
                  {cat.SubCategories && cat.SubCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {cat.SubCategories.slice(0, 3).map((sub: any) => (
                        <Link
                          key={sub.sub_category_id}
                          href={`/products?category=${slugify(cat.category_name)}&subcategory=${slugify(sub.sub_category_name)}`}
                          className="bg-[#FAF8F3] hover:bg-[#D5C58A]/30 text-[#4A4229] text-[10px] font-extrabold px-3 py-1 rounded-lg border border-[#EAE4D3] transition-colors"
                        >
                          {sub.sub_category_name}
                        </Link>
                      ))}
                      {cat.SubCategories.length > 3 && (
                        <span className="text-[10px] text-[#857A68] font-bold self-center px-1">
                          +{cat.SubCategories.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* CTA Button */}
                  <Link
                    href={`/products?category=${slugify(cat.category_name)}`}
                    className="flex items-center justify-center gap-2 w-full bg-[#FAF8F3] group-hover:bg-[#D5C58A] text-[#2C271D] font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl border border-[#D5C58A] transition-all duration-300 shadow-xs"
                  >
                    Browse Collection
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
