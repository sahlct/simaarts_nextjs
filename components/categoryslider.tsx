"use client";

import { useEffect, useRef, useState } from "react";
import { getCategoriesWithSubCategoriesAndProductCount } from "@/lib/api/category";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slugify";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CategorySlider() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const loadCategories = async () => {
    try {
      const res = await getCategoriesWithSubCategoriesAndProductCount();
      if (res?.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error("Category fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleScrollToSlide = (index: number) => {
    if (!stRef.current) return;
    
    // Using the exact ScrollTrigger start position and adding 100vh per index.
    const startY = stRef.current.start;
    const windowHeight = window.innerHeight;
    const targetY = startY + (index * windowHeight);
    
    window.scrollTo({
      top: targetY,
      behavior: "smooth"
    });
  };

  const handlePrev = () => {
    if (activeIndex > 0) handleScrollToSlide(activeIndex - 1);
  };

  const handleNext = () => {
    if (activeIndex < categories.length - 1) handleScrollToSlide(activeIndex + 1);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (loading || categories.length === 0) return;

    let ctx = gsap.context(() => {
      const slides = gsap.utils.toArray(".category-slide") as HTMLElement[];
      
      if (slides.length < 2) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${(slides.length - 1) * 100}%`,
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const index = Math.min(
              slides.length - 1,
              Math.max(0, Math.round(self.progress * (slides.length - 1)))
            );
            setActiveIndex(index);
          }
        }
      });
      stRef.current = tl.scrollTrigger || null;

      slides.forEach((slide, i) => {
        if (i === 0) return;
        // Hide subsequent slides initially and slide them in from right
        gsap.set(slide, { xPercent: 100, autoAlpha: 1, zIndex: i + 10 });
        tl.to(slide, { xPercent: 0, ease: "none" });
      });
      
    }, containerRef);

    return () => ctx.revert();
  }, [loading, categories]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-white">Loading Categories...</div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-[#111827] overflow-hidden">
      {categories.map((cat, idx) => (
        <div
          key={cat.category_id}
          className={`category-slide absolute inset-0 w-full h-full ${idx === 0 ? "z-10" : "z-0"}`}
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-[#0F172A]">
            <img
              src={cat.category_image ? base_url + cat.category_image : "/placeholder.png"}
              alt={cat.category_name}
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-20 w-full h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-center lg:justify-between pt-20 pb-24">
            
            {/* Left Side: Category Info */}
            <div className="w-full lg:w-5/12 flex flex-col text-white z-30 mb-10 lg:mb-0">
              <div className="flex items-center gap-4 mb-6 md:mb-10 opacity-80">
                <div className="w-12 h-[2px] bg-white" />
                <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase">
                  Product Categories
                </span>
              </div>

              <div className="inline-flex items-center gap-2 bg-[#b58500]/90 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded mb-4 w-max shadow-lg">
                <span className="grid place-items-center w-4 h-4 bg-white/20 rounded-sm">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </span>
                FOUNDATION OF ELEGANCE
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                {cat.category_name}
              </h1>
              
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-10 max-w-md">
                Premium imported {cat.category_name.toLowerCase()} sourced from Italy, Spain, and Portugal. From large-format porcelain slabs to intricate mosaic floors — every step is a statement of quality and design.
              </p>

              <div className="flex flex-row gap-3 md:gap-4">
                <Link
                  href={`/products?category=${slugify(cat.category_name)}`}
                  className="flex items-center justify-center gap-2 bg-[#b58500] hover:bg-[#9a7000] text-white px-4 md:px-8 py-2.5 md:py-3.5 rounded-lg font-bold text-[10px] md:text-sm transition-all shadow-lg shadow-yellow-900/20 whitespace-nowrap"
                >
                  Browse Collection <ArrowRight size={14} className="md:w-4 md:h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white px-5 md:px-8 py-2.5 md:py-3.5 rounded-lg font-bold text-[10px] md:text-sm transition-all whitespace-nowrap"
                >
                  Get a Quote
                </Link>
              </div>
            </div>

            {/* Right Side: SubCategories Grid */}
            <div className="w-full lg:w-6/12 flex justify-center lg:justify-end z-30">
              <div className="grid grid-cols-2 gap-3 md:gap-4 w-full max-w-2xl">
                {cat.SubCategories && cat.SubCategories.slice(0, 4).map((sub: any) => (
                  <Link
                    href={`/products?category=${slugify(cat.category_name)}&subcategory=${slugify(sub.sub_category_name)}`}
                    key={sub.sub_category_id} 
                    className="group relative h-[150px] md:h-[200px] rounded-2xl overflow-hidden shadow-2xl block"
                  >
                    <img 
                      src={sub.sub_category_image ? base_url + sub.sub_category_image : "/placeholder.png"} 
                      alt={sub.sub_category_name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent" />
                    
                    {/* Items count badge */}
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                      {sub.productCount || 0} items
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 p-5 w-full">
                      <h4 className="text-white font-bold text-lg mb-1">{sub.sub_category_name}</h4>
                      <p className="text-gray-400 text-xs font-medium">Exquisite {sub.sub_category_name.toLowerCase()} selections</p>
                    </div>
                  </Link>
                ))}
                
                {(!cat.SubCategories || cat.SubCategories.length === 0) && (
                  <div className="col-span-2 text-center text-white/50 py-10">
                    No subcategories found.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      ))}

      {/* Bottom Navigation */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-6">
        
        {/* Pagination Controls */}
        <div className="flex items-center gap-2 md:gap-4 bg-white/5 backdrop-blur-xl px-4 md:px-6 py-2 rounded-full border border-white/10 shadow-2xl">
          <button 
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className={`p-2 transition-colors ${activeIndex === 0 ? 'text-white/20 cursor-not-allowed pointer-events-none' : 'text-white/50 hover:text-white cursor-pointer'}`}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-white text-[10px] md:text-xs font-black tracking-[0.3em] px-2 whitespace-nowrap flex items-center">
            {String(activeIndex + 1).padStart(2, "0")} <span className="mx-2 opacity-30">/</span> {String(categories.length).padStart(2, "0")}
          </span>
          <button 
            onClick={handleNext}
            disabled={activeIndex === categories.length - 1}
            className={`p-2 transition-colors ${activeIndex === categories.length - 1 ? 'text-white/20 cursor-not-allowed pointer-events-none' : 'text-white/50 hover:text-white cursor-pointer'}`}
          >
            <ChevronRight size={16} />
          </button>
        </div>


        {/* Category Quick Links (Visual only) */}
        <div className="hidden md:flex items-center gap-3 pointer-events-none">
          {categories.map((cat, idx) => (
            <div
              key={cat.category_id}
              className={`px-6 py-2 rounded-full border text-xs font-bold transition-all ${
                activeIndex === idx 
                  ? "bg-white/20 border-white text-white backdrop-blur-md" 
                  : "bg-[#0F172A]/40 border-white/20 text-white/60 backdrop-blur-md"
              }`}
            >
              {cat.category_name}
            </div>
          ))}
        </div>

      </div>
      
      {/* Scroll indicator text (Bottom Left) */}
      <div className="absolute bottom-12 left-12 z-50 hidden md:flex items-center gap-3 text-white/50 text-xs font-medium">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="7" ry="7"></rect><path d="M12 6v4"></path></svg>
        Scroll to explore categories
      </div>

      {/* Side Dots (Right Edge) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
        {categories.map((_, idx) => (
          <div 
            key={idx} 
            className={`transition-all duration-300 rounded-full bg-white ${activeIndex === idx ? "w-6 h-1.5 opacity-100" : "w-1.5 h-1.5 opacity-30"}`}
          />
        ))}
      </div>
    </section>
  );
}
