"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductBySlug } from "@/lib/api/product";

interface Product {
  product_id: number;
  product_name: string;
  product_code: string;
  description: string;
  thumbnail_image: string;
  other_images: string[] | string;
  features?: string[] | string;
  is_new: number;
  is_stock: number;
  price: number;
  mrp: number;
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

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductBySlug(slug);
        const data = res?.data;

        // Normalize the data
        if (data) {
          data.other_images = safeParse(data.other_images);
          data.features = safeParse(data.features);
        }

        setProduct(data);

        // Set default active image from other images
        if (Array.isArray(data?.other_images) && data.other_images.length > 0) {
          setActiveImage(base_url + data.other_images[0]);
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  /* ---------------- WHATSAPP ---------------- */
  const handleWhatsapp = () => {
    if (!product) return;

    const message = `
Product Enquiry:
Name: ${product.product_name}
Code: ${product.product_code}
Category: ${product.ProductCategory?.category_name || "-"}
Subcategory: ${product.SubCategory?.sub_category_name || "-"}
Price: ₹${product.price}
`;
    window.open(
      `https://wa.me/9876543210?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="py-16 pb-0">
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* ================= LEFT IMAGE ================= */}
            <div>
              {loading ? (
                <>
                  <div className="bg-gray-200 rounded-2xl p-6 h-[320px] sm:h-[450px] md:h-[520px] animate-pulse mb-4" />
                  <div className="flex gap-3 justify-around">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-gray-100 rounded-2xl p-6 flex justify-center items-center mb-4 h-[320px] sm:h-[400px] md:h-[450px] w-full">
                    {activeImage && (
                      <img
                        src={activeImage}
                        alt={product?.product_name}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>

                  <div className="flex justify-around gap-3 overflow-x-auto no-scrollbar pb-2 py-3">
                    {/* Other Images */}
                    {Array.isArray(product?.other_images) &&
                      product.other_images.map((img: string, i: number) => {
                        const fullImg = base_url + img;
                        return (
                          <button
                            key={i}
                            onClick={() => setActiveImage(fullImg)}
                            className={`w-20 h-20 border-2 cursor-pointer bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center transition-all overflow-hidden
                              ${activeImage === fullImg ? "border-gray-500 scale-105" : "border-gray-200"}`}
                          >
                            <img
                              src={fullImg}
                              alt={`product-${i}`}
                              className="h-full object-contain"
                            />
                          </button>
                        );
                      })}
                  </div>
                </>
              )}
            </div>

            {/* ================= RIGHT CONTENT ================= */}
            <div className="pt-2 flex flex-col justify-center h-full">
              {loading ? (
                <>
                  <div className="h-4 w-40 bg-gray-200 animate-pulse mb-3 rounded" />
                  <div className="h-8 w-3/4 bg-gray-200 animate-pulse mb-2 rounded" />
                  <div className="h-4 w-1/3 bg-gray-200 animate-pulse mb-4 rounded" />

                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 w-4/5 bg-gray-200 animate-pulse rounded" />
                  </div>

                  <div className="flex gap-3 mb-6">
                    <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                  </div>

                  <div className="h-6 w-32 bg-gray-200 animate-pulse mb-6 rounded" />

                  <div className="h-10 w-52 bg-gray-200 animate-pulse rounded-lg" />
                </>
              ) : (
                <>
                  <div className="mb-2 text-sm text-gray-500 flex items-center gap-2">
                    <span className="font-medium text-gray-700">
                      Product Code:
                    </span>
                    {product?.product_code}
                  </div>

                  <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1">
                    {product?.product_name}
                  </h1>

                  <p className="text-sm text-orange-500 mb-4">
                    {product?.SubCategory?.sub_category_name}
                  </p>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {product?.description}
                  </p>

                  <div className="flex gap-3 mb-6">
                    {product?.is_stock === 1 && (
                      <span className="text-sky-600 bg-sky-100 px-5 py-0.5 rounded-full text-sm">
                        In Stock
                      </span>
                    )}
                    {product?.is_new === 1 && (
                      <span className="text-orange-600 bg-orange-100 px-5 py-0.5 rounded-full text-sm">
                        New Item
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-xl font-bold">₹{product?.price}</span>
                    {product?.mrp && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.mrp}
                      </span>
                    )}
                  </div>

                  {Array.isArray(product?.features) && product.features.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Features</h3>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        {product.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleWhatsapp}
                    className="bg-green-500 hover:bg-green-600 cursor-pointer w-full md:w-fit text-white px-8 py-3 rounded-lg text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    Enquire via WhatsApp
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
