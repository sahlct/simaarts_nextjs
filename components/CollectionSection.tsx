"use client";

import { useEffect, useRef, useState } from "react";
import { getProducts } from "@/lib/api/product";
import { ArrowRight, MoveRight } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { slugify } from "@/lib/api/slugify";

interface Product {
  product_id: number;
  product_name: string;
  product_code: string;
  thumbnail_image: string;
  description: string;
  price: string;
  is_new: number;
  is_best_selling: number;
  SubCategory?: {
    sub_category_name: string;
  };
}

const ProductCard = ({ product }: { product: Product }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const centerX = width / 2;
    const centerY = height / 2;

    const rotateX = (y - centerY) / 12;
    const rotateY = (centerX - x) / 12;

    gsap.to(cardRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.02,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  };

  const badge = product.is_best_selling ? "Best Seller" : product.is_new ? "New" : product.product_id % 3 === 0 ? "Premium" : null;
  const badgeColor = "bg-[#0F172A]"; // Match the dark navy/black in image

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group w-full cursor-pointer h-full"
      style={{ perspective: "1500px" }}
    >
      <div
        ref={cardRef}
        className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden transition-shadow duration-500 group-hover:shadow-2xl flex flex-col h-full relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Badge */}
        {badge && (
          <div 
            className={`absolute top-5 right-5 z-20 ${badgeColor} text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.1em] shadow-lg`}
            style={{ transform: "translateZ(40px)" }}
          >
            {badge}
          </div>
        )}

        {/* Image Container */}
        <div 
          className="relative aspect-square overflow-hidden bg-gray-50 m-2 rounded-[1.5rem]"
          style={{ transform: "translateZ(20px)" }}
        >
          <img
            src={product.thumbnail_image ? `${base_url}${product.thumbnail_image}` : "/placeholder.png"}
            alt={product.product_name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div 
          className="p-6 pt-4 flex flex-col flex-grow"
          style={{ transform: "translateZ(30px)" }}
        >
          <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            {product.SubCategory?.sub_category_name || "Porcelain"}
          </span>
          <h3 className="text-lg font-bold text-[#0F172A] mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.product_name}
          </h3>
          <p className="text-gray-400 text-xs mb-6 line-clamp-2 leading-relaxed font-medium">
            {product.description || "Italian-inspired marble-look porcelain with gold veining"}
          </p>

          <div className="mt-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xl font-black text-[#0F172A]">${product.price || "68.00"}</span>
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">per m²</span>
            </div>
            <Link
              href={`/products/${slugify(product.product_name)}`}
              className="flex items-center gap-2 text-[#0F172A] text-[10px] font-black border-2 border-gray-100 px-5 py-2.5 rounded-xl hover:border-[#0F172A] hover:bg-[#0F172A] hover:text-white transition-all duration-300"
            >
              View Details <MoveRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

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
              Premium Clay Tiles <br /> For Every Architecture
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
