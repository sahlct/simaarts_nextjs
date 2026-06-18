import ProductDetailsClient from "./ProductDetailsClient";
import { getProductBySlug } from "@/lib/api/product";
import { Metadata } from "next";

interface Props {
  params: {
    slug: string;
  };
  searchParams: {
    category_id?: string;
    sub_category_id?: string;
  };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const slug = params?.slug;
  const category_id = searchParams?.category_id;
  const sub_category_id = searchParams?.sub_category_id;

  try {
    const res = await getProductBySlug(slug, category_id, sub_category_id);
    const product = res?.data;
    if (!product) return {};

    const base_url = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const imageUrl = product.thumbnail_image
      ? (product.thumbnail_image.startsWith("http")
        ? product.thumbnail_image
        : `${base_url}${product.thumbnail_image}`)
      : "https://elbanoindia.com/elbano_logo.png";

    return {
      title: `${product.product_name} | ELBANO`,
      description: product.description || "Premium Ceramic Tiles & Roofing Solutions",
      openGraph: {
        title: product.product_name,
        description: product.description || "Premium Ceramic Tiles & Roofing Solutions",
        url: `https://elbanoindia.com/products/${slug}`,
        siteName: "ELBANO",
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: product.product_name,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.product_name,
        description: product.description || "Premium Ceramic Tiles & Roofing Solutions",
        images: [imageUrl],
      },
    };
  } catch (e) {
    console.error("Failed to generate metadata:", e);
    return {};
  }
}

export default function ProductDetailsPage() {
  return <ProductDetailsClient />;
}
