"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCategories } from "@/lib/api/category";
import { getProducts } from "@/lib/api/product";
import { useDebounce } from "@/hooks/debounce";
import { slugify } from "@/lib/api/slugify";
import ProductCard, { Product } from "./ProductCard";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Category {
  category_id: number;
  category_name: string;
}

const getCategoryBySlug = (slug: string, list: Category[]) => {
  return list.find((c) => slugify(c.category_name) === slug);
};

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const categoryRefs = useRef<Record<number, HTMLButtonElement | null>>({});

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
  const PRODUCT_LIMIT = 20;

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

  /* LOAD PRODUCTS */
  useEffect(() => {
    let isCurrent = true;

    const loadProducts = async () => {
      try {
        setProdLoading(true);
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

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory]);

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

  return (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-[200px] md:h-[300px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/product_bg.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-white">
          <nav className="mb-4">
            <ol className="flex items-center justify-start space-x-2 text-white/80 text-[10px] md:text-xs font-bold uppercase tracking-widest">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
              </li>
              <li className="opacity-50">/</li>
              <li className="text-white">Products</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none capitalize">
            Our <span className="text-blue-400">Products</span>
          </h1>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="sticky top-[80px] z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Categories */}
          <div
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onMouseMove={onMouseMove}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing w-full md:w-auto"
          >
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-6 py-2.5 cursor-pointer rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${selectedCategory === null
                ? "bg-[#1e2b58] text-white shadow-lg"
                : "bg-gray-200 text-gray-400 hover:text-[#1e2b58] hover:bg-gray-50"
                }`}
            >
              All
            </button>
            {catLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-9 w-24 bg-gray-100 rounded-full animate-pulse" />
              ))
            ) : (
              categories.map((c) => (
                <button
                  key={c.category_id}
                  ref={(el) => {
                    categoryRefs.current[c.category_id] = el;
                  }}
                  onClick={() => handleCategoryClick(c)}
                  className={`px-6 py-2.5 cursor-pointer rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${selectedCategory === c.category_id
                    ? "bg-[#1e2b58] text-white shadow-lg"
                    : "bg-gray-200 text-gray-400 hover:text-[#1e2b58] hover:bg-gray-50"
                    }`}
                >
                  {c.category_name}
                </button>
              ))
            )}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0F172A] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-100 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-800 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
        {prodLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] h-[450px] animate-pulse shadow-sm border border-gray-100" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="p-3 rounded-xl border-2 border-gray-100 text-[#0F172A] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A] transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === i + 1
                        ? "bg-[#0F172A] text-white shadow-lg"
                        : "bg-white text-gray-400 hover:bg-gray-50"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="p-3 rounded-xl border-2 border-gray-100 text-[#0F172A] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A] transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-24 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-6">
              <Search className="text-gray-300" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-[#0F172A] mb-2">No Products Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              We couldn't find any products matching your current filters. Try adjusting your search or category selection.
            </p>
            <button
              onClick={() => {
                setSearch("");
                handleCategoryClick(null);
              }}
              className="mt-8 px-8 py-3 bg-[#0F172A] text-white rounded-xl font-bold text-sm hover:bg-[#15203A] transition-all shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
