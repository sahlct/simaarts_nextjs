"use client";

import { useRef } from "react";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { gsap } from "gsap";
import { slugify } from "@/lib/api/slugify";

export interface Product {
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
  ProductCategory?: {
    category_name: string;
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
  const badgeColor = "bg-[#0F172A]"; 

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
            src={product.thumbnail_image ? (product.thumbnail_image?.startsWith('http') ? product.thumbnail_image : `${base_url}${product.thumbnail_image}`) : "/placeholder.png"}
            alt={product.product_name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div 
          className="p-6 pt-4 flex flex-col flex-grow"
          style={{ transform: "translateZ(30px)" }}
        >
          <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 line-clamp-1">
            {[product.ProductCategory?.category_name, product.SubCategory?.sub_category_name].filter(Boolean).join(" • ") || "Porcelain"}
          </span>
          <h3 className="text-lg font-bold text-[#0F172A] mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.product_name}
          </h3>
          <p className="text-gray-400 text-xs mb-6 line-clamp-2 leading-relaxed font-medium">
            {product.description || "Italian-inspired marble-look porcelain with gold veining"}
          </p>

          <div className="mt-auto flex items-center pt-4">
            <Link
              href={`/products/${slugify(product.product_name)}`}
              className="flex w-full justify-center items-center gap-2 bg-gray-50 text-[#0F172A] text-[10px] font-black border-2 border-gray-200 px-5 py-2.5 rounded-xl hover:border-[#0F172A] hover:bg-[#0F172A] hover:text-white transition-all duration-300"
            >
              View Details <MoveRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
