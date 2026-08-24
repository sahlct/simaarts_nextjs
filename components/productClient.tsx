"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCategories } from "@/lib/api/category";
import { getSubCategories } from "@/lib/api/subCategory";
import { getPublicProducts } from "@/lib/api/product";
import { useDebounce } from "@/hooks/debounce";
import { slugify } from "@/lib/api/slugify";
import ProductCard, { Product } from "./ProductCard";
import { Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import Link from "next/link";

interface Category {
  category_id: number;
  category_name: string;
}

interface SubCategory {
  sub_category_id: number;
  sub_category_name: string;
  category_id?: number;
}

const getCategoryBySlug = (slug: string, list: Category[]) => {
  return list.find((c) => slugify(c.category_name) === slug);
};

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const subScrollRef = useRef<HTMLDivElement | null>(null);
  const categoryRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [catLoading, setCatLoading] = useState(true);
  const [subCatLoading, setSubCatLoading] = useState(false);
  const [prodLoading, setProdLoading] = useState(true);

  const CATEGORY_LIMIT = 100;
  const PRODUCT_LIMIT = 20;

  /* DRAG SCROLL FOR MAIN CATEGORIES */
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

  /* DRAG SCROLL FOR SUBCATEGORIES */
  const subIsDown = useRef(false);
  const subStartX = useRef(0);
  const subScrollLeftPos = useRef(0);

  const onSubMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!subScrollRef.current) return;
    subIsDown.current = true;
    subStartX.current = e.pageX - subScrollRef.current.offsetLeft;
    subScrollLeftPos.current = subScrollRef.current.scrollLeft;
  };

  const stopSubDrag = () => (subIsDown.current = false);

  const onSubMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!subIsDown.current || !subScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - subScrollRef.current.offsetLeft;
    subScrollRef.current.scrollLeft =
      subScrollLeftPos.current - (x - subStartX.current) * 1.5;
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

  /* LOAD SUBCATEGORIES WHEN CATEGORY CHANGES */
  useEffect(() => {
    if (selectedCategory === null) {
      setSubCategories([]);
      setSelectedSubCategory(null);
      return;
    }

    const loadSubCategories = async () => {
      try {
        setSubCatLoading(true);
        const res = await getSubCategories(
          1,
          100,
          "",
          1,
          selectedCategory
        );
        setSubCategories(res?.data || []);
      } catch (err) {
        console.error(err);
        setSubCategories([]);
      } finally {
        setSubCatLoading(false);
      }
    };

    loadSubCategories();
  }, [selectedCategory]);

  /* READ CATEGORY & SUBCATEGORY FROM URL */
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

  useEffect(() => {
    const subCategorySlug = searchParams.get("subcategory");

    if (!subCategorySlug || !subCategories.length) {
      setSelectedSubCategory(null);
      return;
    }

    const matched = subCategories.find(
      (s) => slugify(s.sub_category_name) === subCategorySlug
    );

    if (matched) {
      setSelectedSubCategory(matched.sub_category_id);
    } else {
      setSelectedSubCategory(null);
    }
  }, [subCategories, searchParams]);

  /* LOAD PRODUCTS */
  useEffect(() => {
    let isCurrent = true;

    const loadProducts = async () => {
      try {
        setProdLoading(true);
        const res = await getPublicProducts(page, PRODUCT_LIMIT, debouncedSearch, {
          category_id: selectedCategory ?? undefined,
          sub_category_id: selectedSubCategory ?? undefined,
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
  }, [page, debouncedSearch, selectedCategory, selectedSubCategory]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory, selectedSubCategory]);

  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handleCategoryClick = (c: Category | null) => {
    setPage(1);
    setSelectedSubCategory(null);

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

  const handleSubCategoryClick = (sub: SubCategory | null) => {
    setPage(1);

    if (!sub) {
      setSelectedSubCategory(null);
      if (selectedCategory) {
        const matchedCat = categories.find(c => c.category_id === selectedCategory);
        if (matchedCat) {
          router.push(`/products?category=${slugify(matchedCat.category_name)}`, { scroll: false });
          return;
        }
      }
      router.push("/products", { scroll: false });
    } else {
      setSelectedSubCategory(sub.sub_category_id);
      const subSlug = slugify(sub.sub_category_name);
      if (selectedCategory) {
        const matchedCat = categories.find(c => c.category_id === selectedCategory);
        if (matchedCat) {
          router.push(`/products?category=${slugify(matchedCat.category_name)}&subcategory=${subSlug}`, { scroll: false });
          return;
        }
      }
      router.push(`/products?subcategory=${subSlug}`, { scroll: false });
    }
  };

  return (
    <div className="bg-[#FAF8F3] min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-[300px] md:h-[340px] flex items-center overflow-hidden bg-[#2C271D]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: "url('/product_bg.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C271D] via-[#2C271D]/90 to-[#3D3622]/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-white pt-16">
          <nav className="mb-3">
            <ol className="flex items-center justify-start space-x-2 text-[#D5C58A] text-[10px] md:text-xs font-extrabold uppercase tracking-widest">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li className="opacity-50">/</li>
              <li className="text-white">Products</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-none">
            Scout & Guide <span className="text-[#D5C58A]">Products</span>
          </h1>
          <p className="text-gray-300 text-xs md:text-sm max-w-xl mt-3 font-medium">
            Explore certified embroidered badges, uniforms, scarves, belts, caps, and official troop accessories.
          </p>
        </div>
      </section>

      {/* FILTER BAR & SUBCATEGORY SELECTOR */}
      <section className="sticky top-[70px] md:top-[80px] z-30 bg-white/95 backdrop-blur-md border-b border-[#EAE4D3] shadow-xs">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 md:py-4 space-y-3">
          {/* Main Categories & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div
              ref={scrollRef}
              onMouseDown={onMouseDown}
              onMouseUp={stopDrag}
              onMouseLeave={stopDrag}
              onMouseMove={onMouseMove}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing w-full md:w-auto pb-1 md:pb-0"
            >
              <button
                onClick={() => handleCategoryClick(null)}
                className={`px-4 py-2 cursor-pointer rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${selectedCategory === null
                  ? "bg-[#4A4229] text-[#FAF8F3] shadow-md"
                  : "bg-[#FAF8F3] text-[#5A5243] hover:bg-[#D5C58A]/30 hover:text-[#2C271D] border border-[#EAE4D3]"
                  }`}
              >
                All Items
              </button>
              {catLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 w-24 bg-[#FAF8F3] rounded-full animate-pulse border border-[#EAE4D3]" />
                ))
              ) : (
                categories.map((c) => (
                  <button
                    key={c.category_id}
                    ref={(el) => {
                      categoryRefs.current[c.category_id] = el;
                    }}
                    onClick={() => handleCategoryClick(c)}
                    className={`px-4 py-2 cursor-pointer rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${selectedCategory === c.category_id
                      ? "bg-[#4A4229] text-[#FAF8F3] shadow-md"
                      : "bg-[#FAF8F3] text-[#5A5243] hover:bg-[#D5C58A]/30 hover:text-[#2C271D] border border-[#EAE4D3]"
                      }`}
                  >
                    {c.category_name}
                  </button>
                ))
              )}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#857A68] group-focus-within:text-[#2C271D] transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search badges, uniforms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#EAE4D3] rounded-xl py-2 pl-11 pr-4 text-xs font-semibold text-[#2C271D] focus:ring-2 focus:ring-[#D5C58A] outline-none transition-all"
              />
            </div>
          </div>

          {/* Subcategories Filter Row - Only shown when a specific category is selected */}
          {selectedCategory !== null && (subCatLoading || subCategories.length > 0) && (
            <div
              ref={subScrollRef}
              onMouseDown={onSubMouseDown}
              onMouseUp={stopSubDrag}
              onMouseLeave={stopSubDrag}
              onMouseMove={onSubMouseMove}
              className="pt-2 border-t border-[#EAE4D3]/60 flex items-center gap-2 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing w-full py-1"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#857A68] shrink-0 flex items-center gap-1 mr-1">
                <Filter size={12} className="text-[#8C7E4F]" /> Sub-Category:
              </span>

              <button
                onClick={() => handleSubCategoryClick(null)}
                className={`px-3.5 py-1.5 cursor-pointer rounded-lg text-[11px] font-bold tracking-wide whitespace-nowrap shrink-0 transition-all ${selectedSubCategory === null
                  ? "bg-[#D5C58A] text-[#2C271D] font-extrabold shadow-xs"
                  : "bg-white text-[#5A5243] hover:bg-[#FAF8F3] border border-[#EAE4D3]"
                  }`}
              >
                All Subcategories
              </button>

              {subCatLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-7 w-20 bg-[#FAF8F3] rounded-lg animate-pulse border border-[#EAE4D3] shrink-0" />
                ))
              ) : (
                subCategories.map((sub) => (
                  <button
                    key={sub.sub_category_id}
                    onClick={() => handleSubCategoryClick(sub)}
                    className={`px-3.5 py-1.5 cursor-pointer rounded-lg text-[11px] font-bold tracking-wide whitespace-nowrap shrink-0 transition-all ${selectedSubCategory === sub.sub_category_id
                      ? "bg-[#D5C58A] text-[#2C271D] font-extrabold shadow-xs"
                      : "bg-white text-[#5A5243] hover:bg-[#FAF8F3] border border-[#EAE4D3]"
                      }`}
                  >
                    {sub.sub_category_name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* DIRECT PRODUCT GRID */}
      <section className="py-10 md:py-16 max-w-7xl mx-auto px-6 md:px-12">
        {/* Active Selection Info Header */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#EAE4D3]">
          <div>
            <h2 className="text-lg md:text-2xl font-black text-[#2C271D] tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-5 bg-[#D5C58A] rounded-full inline-block" />
              {selectedCategory
                ? categories.find(c => c.category_id === selectedCategory)?.category_name || "Products"
                : "All Scout & Guide Items"}
              {selectedSubCategory && (
                <span className="text-[#8C7E4F] font-bold text-sm md:text-lg">
                  / {subCategories.find(s => s.sub_category_id === selectedSubCategory)?.sub_category_name}
                </span>
              )}
            </h2>
            <p className="text-xs text-[#857A68] font-medium mt-1">
              Showing direct product listing ({products.length} items)
            </p>
          </div>
        </div>

        {prodLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] h-[440px] animate-pulse shadow-sm border border-[#EAE4D3]" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            {/* DIRECT UNIFIED GRID LISTING */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
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
                  className="p-3 rounded-xl border border-[#EAE4D3] bg-white text-[#2C271D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#D5C58A] transition-all cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${page === i + 1
                        ? "bg-[#4A4229] text-[#FAF8F3] shadow-md"
                        : "bg-white text-[#5A5243] hover:bg-[#D5C58A]/30 border border-[#EAE4D3]"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="p-3 rounded-xl border border-[#EAE4D3] bg-white text-[#2C271D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#D5C58A] transition-all cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FAF8F3] border border-[#EAE4D3] rounded-full mb-4">
              <Search className="text-[#857A68]" size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#2C271D] mb-2">No Products Found</h3>
            <p className="text-[#6E6454] max-w-md mx-auto text-sm font-medium">
              We couldn't find any products matching your current search or subcategory filter.
            </p>
            <button
              onClick={() => {
                setSearch("");
                handleCategoryClick(null);
              }}
              className="mt-6 px-7 py-3 bg-[#D5C58A] text-[#2C271D] rounded-xl font-extrabold text-xs uppercase tracking-wider hover:bg-[#c4b377] transition-all shadow-md cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

