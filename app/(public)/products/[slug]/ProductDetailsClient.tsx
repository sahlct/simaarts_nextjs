"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getProductBySlug, getSimilarProducts } from "@/lib/api/product";
import Link from "next/link";
import {
  Phone,
  ShieldCheck,
  Truck,
  Leaf,
  MessageCircle,
  ChevronRight,
  Droplet,
  Snowflake,
  Flame,
  Feather,
  Dumbbell
} from "lucide-react";
import { useCompanyProfile } from "@/context/CompanyProfileContext";
import ProductCard, { Product } from "@/components/ProductCard";

interface ExtendedProduct extends Product {
  dimensions?: string;
  thickness?: string;
  finish?: string;
  origin?: string;
  color?: string;
  material?: string;
  other_images: string[] | string;
  features?: string[] | string;
  is_stock: number;
  mrp: any;
  ProductCategory?: {
    category_name: string;
  };
  SubCategory?: {
    sub_category_name: string;
  };
}

const safeParse = (data: any) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }
  return [];
};

function ProductDetails() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const category_id = searchParams?.get("category_id");
  const sub_category_id = searchParams?.get("sub_category_id");
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeImage, setActiveImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [simLoading, setSimLoading] = useState(true);
  const { links } = useCompanyProfile();

  useEffect(() => {
    if (!slug) return;

    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductBySlug(slug, category_id, sub_category_id);
        const data = res?.data;

        if (data) {
          data.other_images = safeParse(data.other_images);
          data.features = safeParse(data.features);
          setProduct(data);

          // Set default active image
          if (Array.isArray(data.other_images) && data.other_images.length > 0) {
            setActiveImage((data.other_images[0]?.startsWith('http') ? data.other_images[0] : base_url + data.other_images[0]));
          } else if (data.thumbnail_image) {
            setActiveImage((data.thumbnail_image?.startsWith('http') ? data.thumbnail_image : base_url + data.thumbnail_image));
          }

          // Load Similar Products
          loadSimilar(data.product_id);
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    const loadSimilar = async (id: number) => {
      try {
        setSimLoading(true);
        const res = await getSimilarProducts(id, 4);
        setSimilarProducts(res?.data || []);
      } catch (err) {
        console.error("Failed to load similar products", err);
      } finally {
        setSimLoading(false);
      }
    };

    loadProduct();
  }, [slug, category_id, sub_category_id]);

  const handleWhatsapp = () => {
    if (!product) return;
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const message = `Product Enquiry:
Name: ${product.product_name}
Code: ${product.product_code}
Category: ${product.ProductCategory?.category_name || "-"}

Product Link: ${pageUrl}`;
    window.open(`${links.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleCall = () => {
    window.open(links.tel, "_self");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="h-[500px] bg-gray-100 rounded-[2rem]" />
          <div className="space-y-6">
            <div className="h-4 w-32 bg-gray-100 rounded" />
            <div className="h-12 w-3/4 bg-gray-100 rounded" />
            <div className="h-8 w-1/4 bg-gray-100 rounded" />
            <div className="h-32 w-full bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="py-24 text-center text-[#2C271D] font-bold">Product not found</div>;

  const numericPrice = Number(product.price || 0);
  const numericMrp = Number(product.mrp || 0);
  const hasDiscount = numericMrp > numericPrice && numericPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((numericMrp - numericPrice) / numericMrp) * 100)
    : 0;

  return (
    <div className="bg-[#FAF8F3] min-h-screen pt-28 md:pt-36">
      {/* BREADCRUMBS */}
      <nav className="max-w-7xl mx-auto px-6 md:px-12 py-4">
        <ol className="flex items-center space-x-2 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#857A68]">
          <li><Link href="/" className="hover:text-[#2C271D] transition-colors">Home</Link></li>
          <li><ChevronRight size={12} /></li>
          <li><Link href="/products" className="hover:text-[#2C271D] transition-colors">Products</Link></li>
          <li><ChevronRight size={12} /></li>
          <li className="text-[#2C271D] truncate max-w-[180px]">{product.product_name}</li>
        </ol>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-12 pb-24 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* LEFT: IMAGE GALLERY */}
          <div className="lg:col-span-5 space-y-4 md:space-y-6 w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative aspect-square bg-white rounded-[2.5rem] overflow-hidden border border-[#EAE4D3] group shadow-xl">
              {product.is_best_selling === 1 && (
                <div className="absolute top-6 left-6 z-10 bg-[#4A4229] text-[#FAF8F3] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-md">
                  Best Seller
                </div>
              )}
              {hasDiscount && (
                <div className="absolute top-6 right-6 z-10 bg-[#D5C58A] text-[#2C271D] text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-md">
                  {discountPercent}% OFF
                </div>
              )}
              <img
                src={activeImage}
                alt={product.product_name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
            </div>

            {Array.isArray(product.other_images) && product.other_images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 pb-2 w-full">
                {Array.from({ length: 4 }).map((_, i) => {
                  const img = product.other_images[i];
                  if (img) {
                    const fullImg = (img?.startsWith('http') ? img : base_url + img);
                    return (
                      <button
                        key={i}
                        onClick={() => setActiveImage(fullImg)}
                        className={`relative aspect-square w-full rounded-2xl overflow-hidden border-2 transition-all ${activeImage === fullImg ? "border-[#D5C58A] shadow-md scale-102" : "border-[#EAE4D3] bg-white hover:border-[#D5C58A]/50"
                          }`}
                      >
                        <img src={fullImg} alt="" className="w-full h-full object-cover" />
                      </button>
                    );
                  }
                  return (
                    <div
                      key={`placeholder-${i}`}
                      className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-[#EAE4D3] bg-white/50"
                    />
                  );
                })}
              </div>
            )}

            {/* TRUST BADGES */}
            <div className="grid-cols-3 gap-4 pt-8 border-t border-[#EAE4D3] mt-8 hidden md:grid">

              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 bg-white border border-[#EAE4D3] text-[#8C7E4F] rounded-full flex items-center justify-center mb-2 shadow-xs">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-[10px] font-extrabold text-[#2C271D] uppercase tracking-wider">Official Quality</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 bg-white border border-[#EAE4D3] text-[#8C7E4F] rounded-full flex items-center justify-center mb-2 shadow-xs">
                  <Truck size={20} />
                </div>
                <span className="text-[10px] font-extrabold text-[#2C271D] uppercase tracking-wider">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 bg-white border border-[#EAE4D3] text-[#8C7E4F] rounded-full flex items-center justify-center mb-2 shadow-xs">
                  <Leaf size={20} />
                </div>
                <span className="text-[10px] font-extrabold text-[#2C271D] uppercase tracking-wider">Certified Fabrics</span>
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="lg:col-span-7 flex flex-col">
            <span className="text-[#8C7E4F] text-xs font-black uppercase tracking-[0.2em] mb-2.5">
              {[product.ProductCategory?.category_name, product.SubCategory?.sub_category_name].filter(Boolean).join(" • ") || "Scout & Guide Badge"}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-[#2C271D] leading-tight mb-6 tracking-tight">
              {product.product_name}
            </h1>

            {/* MRP CUT & SELLING PRICE HIGHLIGHT */}
            <div className="p-5 bg-white rounded-2xl border border-[#EAE4D3] shadow-xs mb-8 flex items-baseline justify-between max-w-xl">
              <div>
                <span className="block text-[10px] font-black text-[#857A68] uppercase tracking-widest mb-1">
                  Price Highlight
                </span>
                <div className="flex items-baseline gap-3">
                  {numericPrice > 0 ? (
                    <>
                      <span className="text-3xl md:text-4xl font-black text-[#4A4229]">
                        ₹{numericPrice.toLocaleString("en-IN")}
                      </span>
                      {hasDiscount && (
                        <span className="line-through text-base md:text-lg font-bold text-gray-400">
                          ₹{numericMrp.toLocaleString("en-IN")}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xl font-extrabold text-[#8C7E4F]">
                      Request Custom Quote
                    </span>
                  )}
                </div>
              </div>

              {hasDiscount && (
                <div className="bg-[#D5C58A] text-[#2C271D] font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
                  Save ₹{(numericMrp - numericPrice).toLocaleString("en-IN")}
                </div>
              )}
            </div>

            <div className="mb-8 max-w-xl">
              <p className={`text-[#5A5243] text-sm md:text-base leading-relaxed font-medium transition-all duration-500 ${!isExpanded ? "line-clamp-3" : ""}`}>
                {product.description || "Official Scout & Guide item crafted with high-precision embroidery and premium certified material ensuring maximum durability and official compliance."}
              </p>
              {(product.description?.length > 160) && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[#8C7E4F] text-[11px] font-black uppercase tracking-[0.15em] mt-3 hover:text-[#2C271D] transition-colors cursor-pointer flex items-center gap-1"
                >
                  {isExpanded ? "View Less" : "Learn More"}
                  <ChevronRight size={12} className={`transition-transform duration-300 ${isExpanded ? "-rotate-90" : "rotate-0"}`} />
                </button>
              )}
            </div>

            {/* PRODUCT FEATURES */}
            {Array.isArray(product.features) && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs font-black text-[#857A68] uppercase tracking-[0.2em] mb-4">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-[#EAE4D3]">
                      <div className="w-2 h-2 rounded-full bg-[#8C7E4F]" />
                      <span className="text-xs md:text-sm font-bold text-[#2C271D]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA BUTTONS */}
            <div className="space-y-3 md:space-y-4 mb-12 max-w-xl">
              <button
                onClick={handleWhatsapp}
                className="w-full bg-[#25D366] cursor-pointer hover:bg-[#1EBE57] text-white py-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <MessageCircle size={18} fill="white" /> WhatsApp for Quote
              </button>
              <button
                onClick={handleCall}
                className="w-full bg-[#D5C58A] text-[#2C271D] cursor-pointer hover:bg-[#c4b377] py-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-md"
              >
                <Phone size={18} fill="#2C271D" /> Call Us Now
              </button>
            </div>

          </div>
        </div>

        {/* SIMILAR PRODUCTS */}
        <section className="mt-20 md:mt-28 border-t border-[#EAE4D3] pt-12">
          <div className="flex items-center justify-between mb-8 md:mb-12 gap-4">
            <h2 className="text-xl md:text-3xl font-black text-[#2C271D] tracking-tight shrink-0">
              Related Products
            </h2>
            <Link href="/products" className="text-xs font-black uppercase tracking-wider text-[#8C7E4F] cursor-pointer hover:underline text-right">
              View All Products
            </Link>
          </div>

          {simLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-[2rem] h-[440px] animate-pulse border border-[#EAE4D3]" />
              ))}
            </div>
          ) : similarProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarProducts.map((p) => (
                <ProductCard key={p.product_id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-[#857A68] font-medium text-sm">No similar products found.</p>
          )}
        </section>
      </main>
    </div>
  );
}


export default function ProductDetailsClient() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 py-24 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="h-[500px] bg-gray-100 rounded-[2rem]" />
          <div className="space-y-6">
            <div className="h-4 w-32 bg-gray-100 rounded" />
            <div className="h-12 w-3/4 bg-gray-100 rounded" />
            <div className="h-8 w-1/4 bg-gray-100 rounded" />
            <div className="h-32 w-full bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    }>
      <ProductDetails />
    </Suspense>
  );
}
