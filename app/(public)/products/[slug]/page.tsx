"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
import { CONTACT_INFO, CONTACT_LINKS } from "@/lib/contact";
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

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeImage, setActiveImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [simLoading, setSimLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductBySlug(slug);
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
  }, [slug]);

  const handleWhatsapp = () => {
    if (!product) return;
    const message = `Product Enquiry:
Name: ${product.product_name}
Code: ${product.product_code}
Category: ${product.ProductCategory?.category_name || "-"}
Subcategory: ${product.price}`;
    window.open(`${CONTACT_LINKS.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleCall = () => {
    window.open(CONTACT_LINKS.tel, "_self");
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

  if (!product) return <div className="py-24 text-center">Product not found</div>;

  return (
    <div className="bg-[#0B1120] min-h-screen pt-32">
      {/* BREADCRUMBS */}
      <nav className="max-w-7xl mx-auto px-6 md:px-12 py-4">
        <ol className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
          <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
          <li><ChevronRight size={12} /></li>
          <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
          <li><ChevronRight size={12} /></li>
          <li className="text-white truncate max-w-[150px]">{product.product_name}</li>
        </ol>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-12 pb-24 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* LEFT: IMAGE GALLERY */}
          <div className="lg:col-span-5 space-y-4 md:space-y-6 w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative aspect-square bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 group shadow-2xl">
              {product.is_best_selling === 1 && (
                <div className="absolute top-8 left-8 z-10 bg-[#0F172A] text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-lg">
                  Best Seller
                </div>
              )}
              <img
                src={activeImage}
                alt={product.product_name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {Array.isArray(product.other_images) && product.other_images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 md:gap-4 pb-2 w-full">
                {Array.from({ length: 4 }).map((_, i) => {
                  const img = product.other_images[i];
                  if (img) {
                    const fullImg = (img?.startsWith('http') ? img : base_url + img);
                    return (
                      <button
                        key={i}
                        onClick={() => setActiveImage(fullImg)}
                        className={`relative aspect-square w-full rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all ${activeImage === fullImg ? "border-blue-500 shadow-lg shadow-blue-500/20" : "border-white/5 bg-white/5 hover:border-white/20"
                          }`}
                      >
                        <img src={fullImg} alt="" className="w-full h-full object-cover" />
                      </button>
                    );
                  }
                  return (
                    <div
                      key={`placeholder-${i}`}
                      className="relative aspect-square w-full rounded-xl md:rounded-2xl border-2 border-dashed border-white/10 bg-white/5"
                    />
                  );
                })}
              </div>
            )}

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5 mt-8 hidden md:grid">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-white/5 text-blue-400 rounded-full flex items-center justify-center mb-2">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-[9px] font-black text-white/40 uppercase tracking-tighter">30yr Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-white/5 text-blue-400 rounded-full flex items-center justify-center mb-2">
                  <Truck size={20} />
                </div>
                <span className="text-[9px] font-black text-white/40 uppercase tracking-tighter">Delivery Avaialble</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-white/5 text-blue-400 rounded-full flex items-center justify-center mb-2">
                  <Leaf size={20} />
                </div>
                <span className="text-[9px] font-black text-white/40 uppercase tracking-tighter">Eco Fired Clay</span>
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="lg:col-span-7 flex flex-col">
            <span className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-3">
              {[product.ProductCategory?.category_name, product.SubCategory?.sub_category_name].filter(Boolean).join(" • ") || "Porcelain"}
            </span>
            <h1 className="text-2xl md:text-5xl font-black text-white leading-tight mb-8 tracking-tight">
              {product.product_name}
            </h1>

            <div className="mb-10 max-w-xl">
              <p className={`text-white/60 text-sm md:text-base leading-relaxed font-medium transition-all duration-500 ${!isExpanded ? "line-clamp-3" : ""}`}>
                {product.description || "Captured from the breathtaking beauty of Italian marble with striking gold and grey veining. This large-format tile transforms any space into a luxury statement."}
              </p>
              {(product.description?.length > 160) && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  {isExpanded ? "View Less" : "Learn More"}
                  <ChevronRight size={12} className={`transition-transform duration-300 ${isExpanded ? "-rotate-90" : "rotate-0"}`} />
                </button>
              )}
            </div>

            {/* PRODUCT CTA ICONS (SMALL) */}
            <div className="flex justify-between md:justify-start gap-2 md:gap-10 mb-10 w-full ">
              {[
                { label: "Leak Proof", icon: <Droplet size={20} strokeWidth={1.5} /> },
                { label: "Frost Resistant", icon: <Snowflake size={20} strokeWidth={1.5} /> },
                { label: "Heat Resistant", icon: <Flame size={20} strokeWidth={1.5} /> },
                { label: "Light Weight", icon: <Feather size={20} strokeWidth={1.5} /> },
                { label: "Durable", icon: <Dumbbell size={20} strokeWidth={1.5} /> },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-[55px] md:w-[65px]">
                  <div className="w-10 h-10 md:w-12 md:h-12 border border-white/20 rounded-xl flex items-center justify-center text-white bg-transparent">
                    {feature.icon}
                  </div>
                  <span className="text-white/80 text-[9px] md:text-[10px] font-medium text-center leading-snug">
                    {feature.label.split(' ').map((word, idx) => (
                      <span key={idx} className="block">{word}</span>
                    ))}
                  </span>
                </div>
              ))}
            </div>

            {/* PRODUCT FEATURES */}
            {Array.isArray(product.features) && product.features.length > 0 && (
              <div className="mb-10">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 group transition-all hover:bg-white/10">
                      <div className="w-2 h-2 rounded-full bg-blue-500 transition-transform group-hover:scale-125" />
                      <span className="text-sm font-bold text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA BUTTONS */}
            <div className="space-y-3 md:space-y-4 mb-12">
              <button
                onClick={handleWhatsapp}
                className="w-full bg-[#25D366] cursor-pointer hover:bg-[#1EBE57] text-white py-3.5 md:py-5 rounded-xl md:rounded-[1.25rem] font-black text-[10px] md:text-sm uppercase tracking-widest transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 md:gap-3 active:scale-[0.98]"
              >
                <MessageCircle size={16} className="md:w-5 md:h-5" fill="white" /> WhatsApp for Quote
              </button>
              <button
                onClick={handleCall}
                className="w-full bg-white text-[#0F172A] cursor-pointer hover:bg-gray-100 py-3.5 md:py-5 rounded-xl md:rounded-[1.25rem] font-black text-[10px] md:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 md:gap-3 active:scale-[0.98]"
              >
                <Phone size={16} className="md:w-5 md:h-5" fill="#0F172A" /> Call Us Now
              </button>
            </div>


          </div>
        </div>

        {/* SIMILAR PRODUCTS */}
        <section className="mt-20 md:mt-32">
          <div className="flex items-center justify-between mb-8 md:mb-12 gap-4">
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tight shrink-0">
              You May Also Like
            </h2>
            <Link href="/products" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-blue-400 cursor-pointer hover:underline text-right">
              View All Products
            </Link>
          </div>

          {simLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white/5 rounded-[2rem] h-[450px] animate-pulse border border-white/5" />
              ))}
            </div>
          ) : similarProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarProducts.map((p) => (
                <ProductCard key={p.product_id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-white/20 font-medium">No similar products found.</p>
          )}
        </section>
      </main>
    </div>
  );
}
