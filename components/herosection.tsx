"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowRight, ExternalLink, ChevronDown } from "lucide-react";
import Link from "next/link";
import { getCarousels } from "@/lib/api/carousel";

interface CarouselItem {
  carousel_id: number;
  carousel_title: string;
  carousel_title_02: string;
  carousel_title_02_color: string;
  carousel_subheader: string;
  description: string;
  desktop_background: string;
  mobile_background: string;
  status: number;
}

export default function HeroSection({ initialData }: { initialData?: CarouselItem | null }) {
  const [carousel, setCarousel] = useState<CarouselItem | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await getCarousels(1, 1, "", 1);
        if (res?.data && res.data.length > 0) {
          setCarousel(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch carousel data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  useEffect(() => {
    if (loading || !carousel) return;

    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(
        ".hero-content > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          delay: 0.1,
        }
      );

      // Stats animation
      gsap.fromTo(
        ".hero-stats > div",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.5,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, carousel]);

  if (loading) {
    return <div className="h-screen bg-gray-900 animate-pulse" />;
  }

  const renderBackground = (bg: string) => {
    const isVideo = bg?.toLowerCase().endsWith(".mp4") || bg?.toLowerCase().endsWith(".webm");
    const src = bg ? (bg?.startsWith('http') ? bg : `${base_url}${bg}`) : "/hero_01.png";

    if (isVideo) {
      return (
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src={src} type="video/mp4" />
        </video>
      );
    }
    return <img src={src} alt="Hero Background" className="w-full h-full object-cover" />;
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[600px] flex flex-col justify-center items-center text-white overflow-hidden"
    >
      {/* BACKGROUND MEDIA WITH OVERLAY */}
      <div className="absolute inset-0 z-0">
        <div className="hidden md:block w-full h-full">
          {renderBackground(carousel?.desktop_background || "")}
        </div>
        <div className="block md:hidden w-full h-full">
          {renderBackground(carousel?.mobile_background || carousel?.desktop_background || "")}
        </div>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* CONTENT AREA */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center hero-content flex flex-col items-center justify-center h-full pt-10 pb-32">
        {/* SUBTITLE */}
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="h-[1px] w-6 md:w-12 bg-yellow-500" />
          <span className="text-[10px] md:text-sm font-bold tracking-[0.2em] text-yellow-500 uppercase px-2">
            {carousel?.carousel_subheader || "Premium Imported Ceramic Tiles Since 1995"}
          </span>
          <div className="h-[1px] w-6 md:w-12 bg-yellow-500" />
        </div>

        {/* MAIN TITLE */}
        <h1 className="text-3xl md:text-7xl font-extrabold mb-6 md:mb-8 leading-[1.1] tracking-tight">
          {carousel?.carousel_title || "Defining Spaces with"}<br />
          <span style={{ color: carousel?.carousel_title_02_color || "#f5b400" }}>
            {carousel?.carousel_title_02 || "CERAMIC"}
          </span>
        </h1>

        {/* DESCRIPTION */}
        <p className="text-gray-300 text-xs md:text-lg max-w-2xl mb-8 md:mb-10 leading-relaxed font-light px-4">
          {carousel?.description || "Curated imported ceramic tiles from the world's finest manufacturers. Elevate every floor, wall, and surface with timeless quality and design."}
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto px-6 sm:px-0">
          <Link
            href="/products"
            className="group flex items-center justify-center gap-2 bg-[#f5b400] text-black px-8 py-3.5 md:py-4 rounded-lg font-bold text-sm transition-all hover:bg-[#e0a500] active:scale-95 shadow-lg shadow-yellow-500/20"
          >
            Explore Collection
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/projects"
            className="group flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-3.5 md:py-4 rounded-lg font-bold text-sm transition-all hover:bg-white/20 active:scale-95"
          >
            View Projects
            <ExternalLink size={18} />
          </Link>
        </div>
      </div>

      {/* STATS AT BOTTOM */}
      <div className="absolute bottom-10 md:bottom-12 left-0 w-full z-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-3 md:flex md:flex-wrap md:justify-around gap-4 hero-stats text-center items-center">
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-4xl font-bold mb-0.5 md:mb-1 tracking-tighter leading-none">30+</span>
            <span className="text-[8px] md:text-xs text-gray-400 uppercase tracking-widest font-medium leading-none">Years Experience</span>
          </div>
          <div className="flex flex-col items-center border-x border-white/10 md:border-none">
            <span className="text-xl md:text-4xl font-bold mb-0.5 md:mb-1 tracking-tighter leading-none">5,000+</span>
            <span className="text-[8px] md:text-xs text-gray-400 uppercase tracking-widest font-medium leading-none">Tile Designs</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-4xl font-bold mb-0.5 md:mb-1 tracking-tighter leading-none">60+</span>
            <span className="text-[8px] md:text-xs text-gray-400 uppercase tracking-widest font-medium leading-none">Countries Sourced</span>
          </div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40 md:opacity-60">
        <span className="text-[8px] md:text-[10px] font-bold tracking-widest uppercase text-gray-400">Scroll</span>
        <ChevronDown size={16} className="animate-bounce" />
      </div>
    </section>
  );
}
