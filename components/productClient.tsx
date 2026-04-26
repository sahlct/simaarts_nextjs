"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCategories } from "@/lib/api/category";
import { getProducts } from "@/lib/api/product";
import { useDebounce } from "@/hooks/debounce";
import { slugify } from "@/lib/slugify";

interface Category {
  category_id: number;
  category_name: string;
}

interface Product {
  product_id: number;
  product_code: string;
  product_name: string;
  price?: number;
  thumbnail_image: string;

  ProductCategory?: {
    category_name: string;
  };

  SubCategory?: {
    sub_category_name: string;
  };
}

const getCategoryBySlug = (slug: string, list: Category[]) => {
  return list.find((c) => slugify(c.category_name) === slug);
};

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const categoryRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [catLoading, setCatLoading] = useState(true);
  const [prodLoading, setProdLoading] = useState(true);

  const CATEGORY_LIMIT = 100;
  const PRODUCT_LIMIT = 16;

  /* DRAG SCROLL */
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    isDown.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftPos.current = scrollRef.current.scrollLeft;
  };

  const stopDrag = () => (isDown.current = false);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft =
      scrollLeftPos.current - (x - startX.current) * 1.5;
  };

  /* LOAD CATEGORIES */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCatLoading(true);
        const res = await getCategories(1, CATEGORY_LIMIT, "", 1);
        setCategories(res?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setCatLoading(false);
      }
    };
    loadCategories();
  }, []);

  /* READ CATEGORY FROM URL */
  useEffect(() => {
    if (!categories.length) return;

    const categorySlug = searchParams.get("category");

    if (!categorySlug) {
      setSelectedCategory(null);
      return;
    }

    const matched = getCategoryBySlug(categorySlug, categories);

    if (matched) {
      setSelectedCategory(matched.category_id);
    }
  }, [categories, searchParams]);

  /* AUTO SCROLL SELECTED CATEGORY INTO VIEW */
  useEffect(() => {
    if (!selectedCategory) return;
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const el = categoryRefs.current[selectedCategory];

    if (!el) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    // Check if element is outside visible area
    if (
      elRect.left < containerRect.left ||
      elRect.right > containerRect.right
    ) {
      const offset =
        el.offsetLeft - container.clientWidth / 2 + el.clientWidth / 2;

      container.scrollTo({
        left: offset,
        behavior: "smooth",
      });
    }
  }, [selectedCategory]);

  /* LOAD PRODUCTS */
  useEffect(() => {
    let isCurrent = true;

    const loadProducts = async () => {
      try {
        setProdLoading(true);
        // We use the states directly now
        const res = await getProducts(page, PRODUCT_LIMIT, debouncedSearch, {
          category_id: selectedCategory ?? undefined,
          status: 1,
        });

        if (isCurrent) {
          setProducts(res?.data || []);
          setTotalPages(res?.totalPages || 1);
        }
      } catch (err) {
        if (isCurrent) {
          console.error(err);
        }
      } finally {
        if (isCurrent) {
          setProdLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isCurrent = false;
    };
  }, [page, debouncedSearch, selectedCategory]);

  // Reset page to 1 when search or category changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory]);

  /* CATEGORY CLICK */
  const handleCategoryClick = (c: Category | null) => {
    setPage(1);

    if (!c) {
      setSelectedCategory(null);
      router.push("/products", { scroll: false });
    } else {
      setSelectedCategory(c.category_id);
      router.push(`/products?category=${slugify(c.category_name)}`, {
        scroll: false,
      });
    }
  };

  /* WHATSAPP */
  const handleWhatsapp = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    const msg = `
Product Enquiry:
Name: ${p.product_name}
Code: ${p.product_code}
Category: ${p.ProductCategory?.category_name || "-"}
Subcategory: ${p.SubCategory?.sub_category_name || "-"}
Price: ₹${p.price ?? "-"}
`;
    window.open(
      `https://wa.me/9876543210?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <div className="py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 md:py-16 py-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <h1 className="text-3xl font-semibold">Products</h1>
          <input
            placeholder="Search Product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-72 px-4 py-2 border rounded-md"
          />
        </div>

        {/* CATEGORY BAR */}
        <div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onMouseMove={onMouseMove}
          className="flex gap-3 overflow-x-auto no-scrollbar mb-8 cursor-grab scroll-smooth"
        >
          {catLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-24 rounded-full bg-gray-200 animate-pulse"
              />
            ))
          ) : (
            <>
              <button
                onClick={() => handleCategoryClick(null)}
                className={`px-4 py-1.5 cursor-pointer rounded-full border ${selectedCategory === null ? "bg-black text-white" : "bg-white"
                  }`}
              >
                All
              </button>

              {categories.map((c) => (
                <button
                  key={c.category_id}
                  ref={(el) => {
                    categoryRefs.current[c.category_id] = el;
                  }}
                  onClick={() => handleCategoryClick(c)}
                  className={`px-4 text-nowrap cursor-pointer py-1.5 rounded-full border ${selectedCategory === c.category_id
                      ? "bg-black text-white"
                      : "bg-white"
                    }`}
                >
                  {c.category_name}
                </button>
              ))}
            </>
          )}
        </div>

        {/* PRODUCT GRID */}
        <div
          id="product-grid"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-12"
        >
          {prodLoading
            ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-3 animate-pulse">
                <div className="h-56 bg-gray-200 mb-3 rounded" />
                <div className="h-4 bg-gray-200 w-3/4 mb-2 rounded" />
                <div className="h-3 bg-gray-200 w-1/2 rounded" />
              </div>
            ))
            : products.length > 0 ? (
              products.map((p) => (
                <div
                  key={p.product_id}
                  className="bg-white rounded-xl p-3 cursor-pointer group"
                  onClick={() =>
                    router.push(`/products/${slugify(p.product_name)}`)
                  }
                >
                  <div className="h-56 bg-gray-100 flex items-center justify-center mb-3">
                    <img
                      src={base_url + p.thumbnail_image}
                      className="h-full object-contain group-hover:scale-115 transition-all duration-300 ease-in-out"
                    />
                  </div>
                  <p className="text-sm font-medium">{p.product_name}</p>
                  <p className="text-xs text-orange-500">
                    {p.ProductCategory?.category_name}
                  </p>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={(e) => handleWhatsapp(e, p)}
                      className="bg-black hover:bg-gray-800 cursor-pointer text-white text-xs px-4 py-1.5 rounded"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-500 text-lg">No products found in this category.</p>
              </div>
            )}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-6">
          <button
            disabled={page <= 1 || prodLoading || totalPages <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`px-4 py-2 border rounded-full transition ${page <= 1 || prodLoading || totalPages <= 1
                ? "opacity-40 cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-100"
              }`}
          >
            Prev
          </button>

          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages || prodLoading || totalPages <= 1}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`px-4 py-2 border rounded-full transition ${page >= totalPages || prodLoading || totalPages <= 1
                ? "opacity-40 cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-100"
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
