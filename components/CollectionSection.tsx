"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api/product";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCard, { Product } from "./ProductCard";

export default function CollectionSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts(1, 4, "", { status: 1 });
        setProducts(res.data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Decorative background accent */}
      <div className="absolute top-0 right-0 w-[300px] lg:w-[400px] h-[400px] bg-[#FAF8F3] rounded-l-[4rem] z-0" />
      <div className="absolute -bottom-[150px] -left-[150px] w-[400px] h-[400px] bg-[#FAF8F3] rounded-full z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-[#D5C58A]" />
              <span className="text-[#8C7E4F] text-xs font-black tracking-[0.2em] uppercase">
                Featured Collection
              </span>
              <div className="h-[2px] w-10 bg-[#D5C58A]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#2C271D] leading-[1.15] tracking-tight">
              Latest Scout & Guide Supplies
            </h2>
          </div>
          <div className="lg:max-w-xs">
            <p className="text-[#6E6454] text-sm leading-relaxed font-medium">
              High quality precision embroidered badges, official uniforms, scarves, belts, and accessories built for durability and pride.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-[#FAF8F3] rounded-[2rem] h-[440px] animate-pulse border border-[#EAE4D3]" />
              ))
            : products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
        </div>

        {/* View All Button */}
        <div className="mt-16 flex justify-center relative z-10">
          <Link
            href="/products"
            className="group flex items-center justify-center gap-2 bg-[#D5C58A] hover:bg-[#c4b377] text-[#2C271D] px-8 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-md"
          >
            Explore Full Catalog <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

