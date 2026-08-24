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
  price: string | number;
  mrp?: string | number;
  is_new: number;
  is_best_selling: number;
  category_id?: number;
  sub_category_id?: number;
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

    const rotateX = (y - centerY) / 14;
    const rotateY = (centerX - x) / 14;

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

  const badge = product.is_best_selling ? "Best Seller" : product.is_new ? "New" : null;

  // Price calculations
  const numericPrice = Number(product.price || 0);
  const numericMrp = Number(product.mrp || 0);
  const hasDiscount = numericMrp > numericPrice && numericPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((numericMrp - numericPrice) / numericMrp) * 100)
    : 0;

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
        className="bg-white rounded-[2rem] shadow-sm border border-[#EAE4D3] overflow-hidden transition-all duration-500 group-hover:shadow-xl group-hover:border-[#D5C58A] flex flex-col h-full relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Discount / Status Badges */}
        <div
          className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none"
          style={{ transform: "translateZ(40px)" }}
        >
          {badge ? (
            <span className="bg-[#4A4229] text-[#FAF8F3] text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
              {badge}
            </span>
          ) : (
            <span />
          )}

          {hasDiscount && (
            <span className="bg-[#D5C58A] text-[#2C271D] text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md ml-auto">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Image Container */}
        <div
          className="relative aspect-square overflow-hidden bg-[#FAF8F3] m-2.5 rounded-[1.5rem] border border-[#EAE4D3]/50"
          style={{ transform: "translateZ(20px)" }}
        >
          <img
            src={
              product.thumbnail_image
                ? product.thumbnail_image?.startsWith("http")
                  ? product.thumbnail_image
                  : `${base_url}${product.thumbnail_image}`
                : "/placeholder.png"
            }
            alt={product.product_name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          />
        </div>

        {/* Content */}
        <div
          className="p-5 pt-3 flex flex-col flex-grow"
          style={{ transform: "translateZ(30px)" }}
        >
          <span className="text-[#8C7E4F] text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 line-clamp-1">
            {product.SubCategory?.sub_category_name ||
              product.ProductCategory?.category_name ||
              "Scout & Guide Badge"}
          </span>

          <h3 className="text-base md:text-lg font-bold text-[#2C271D] mb-1.5 line-clamp-1 group-hover:text-[#8C7E4F] transition-colors">
            {product.product_name}
          </h3>

          <p className="text-[#6E6454] text-xs mb-4 line-clamp-2 leading-relaxed font-medium">
            {product.description || "Premium official Scout & Guide product crafted with high quality standards."}
          </p>

          {/* Pricing Highlight Section */}
          <div className="mt-auto pt-3 border-t border-[#EAE4D3]/60 flex items-center justify-between mb-4">
            <div>
              <span className="block text-[9px] font-extrabold text-[#857A68] uppercase tracking-wider">
                Price
              </span>
              <div className="flex items-baseline gap-2">
                {numericPrice > 0 ? (
                  <>
                    <span className="text-lg md:text-xl font-black text-[#4A4229]">
                      ₹{numericPrice.toLocaleString("en-IN")}
                    </span>
                    {hasDiscount && (
                      <span className="line-through text-xs font-bold text-gray-400">
                        ₹{numericMrp.toLocaleString("en-IN")}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-sm font-extrabold text-[#8C7E4F]">
                    Ask for Quote
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <Link
              href={`/products/${slugify(product.product_name)}?category_id=${product.category_id || ""}&sub_category_id=${product.sub_category_id || ""}`}
              className="flex w-full justify-center items-center gap-2 bg-[#FAF8F3] text-[#2C271D] text-xs font-black border border-[#D5C58A] px-4 py-2.5 rounded-xl hover:bg-[#D5C58A] hover:text-[#2C271D] transition-all duration-300 shadow-xs"
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

