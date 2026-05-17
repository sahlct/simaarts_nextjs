"use client";

import { useEffect, useRef, useState } from "react";
import { getProducts } from "@/lib/api/product";
import { ArrowRight, MoveRight } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { slugify } from "@/lib/api/slugify";

import ProductCard, { Product } from "./ProductCard";

export default function CollectionSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetching 4 products as requested
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
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-[300px] lg:w-[400px] xl:w-[500px] h-[400px] lg:h-[500px] bg-[#F8FAFC] rounded-l-[4rem] lg:rounded-l-[6rem] z-0" />
      <div className="absolute -bottom-[150px] lg:-bottom-[250px] -left-[150px] lg:-left-[250px] w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-[#F8FAFC] rounded-full z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[2px] w-12 bg-gray-300" />
              <span className="text-blue-900 text-xs font-black tracking-[0.3em] uppercase">
                Our Collection
              </span>
              <div className="h-[2px] w-12 bg-gray-300" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-[#0F172A] leading-[1.1] tracking-tight">
              Premium Tiles <br /> For Every Architecture
            </h2>
          </div>
          <div className="lg:max-w-xs">
            <p className="text-gray-400 text-sm md:text-base leading-relaxed lg:text-right font-medium">
              Each tile is crafted from natural clay, kiln-fired to perfection, and designed to endure for generations.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-[450px] animate-pulse shadow-sm" />
            ))
            : products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
        </div>

        {/* View All Button */}
        <div className="mt-16 flex justify-center relative z-10">
          <Link
            href="/products"
            className="group flex items-center justify-center gap-2 bg-[#1E2B4D] hover:bg-[#15203A] text-white px-8 py-3.5 rounded-lg font-bold text-sm transition-all duration-300 shadow-md"
          >
            View All Products <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
