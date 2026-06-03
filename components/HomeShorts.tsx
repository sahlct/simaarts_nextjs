"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { getShorts } from "@/lib/api/shorts";
import useEmblaCarousel from "embla-carousel-react";
import { Youtube, Instagram, Play, Eye, Heart, Share2 } from "lucide-react";
import gsap from "gsap";

interface Short {
  shorts_id: number;
  shorts_title: string;
  shorts_subtitle: string;
  shorts_type: "youtube" | "insta";
  thumbnail_image: string;
  video_url: string;
}

export default function HomeShorts() {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<"youtube" | "insta">("youtube");
  const [youtubeShorts, setYoutubeShorts] = useState<Short[]>([]);
  const [instaShorts, setInstaShorts] = useState<Short[]>([]);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
    align: "start",
  });

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const loadBoth = async () => {
      setLoading(true);
      try {
        const [ytRes, inRes] = await Promise.all([
          getShorts(1, 12, "", 1, "youtube"),
          getShorts(1, 12, "", 1, "insta")
        ]);
        const ytData = ytRes?.data || [];
        const inData = inRes?.data || [];
        setYoutubeShorts(ytData);
        setInstaShorts(inData);

        if (ytData.length === 0 && inData.length > 0) {
          setActiveType("insta");
        }
        setInitialLoadDone(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (!initialLoadDone) {
      loadBoth();
    }
  }, [initialLoadDone]);

  useEffect(() => {
    if (initialLoadDone) {
      setShorts(activeType === "youtube" ? youtubeShorts : instaShorts);
    }
  }, [activeType, initialLoadDone, youtubeShorts, instaShorts]);

  /* ---------------- WHEEL SUPPORT ---------------- */
  const lastScrollTime = useRef(0);
  const onWheel = useCallback((e: WheelEvent) => {
    if (!emblaApi) return;

    // Check if it's primarily a horizontal scroll
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      const now = Date.now();
      // Add a small cooldown to prevent over-scrolling through many cards at once
      if (now - lastScrollTime.current > 400) {
        if (e.deltaX > 5) {
          emblaApi.scrollNext();
          lastScrollTime.current = now;
        } else if (e.deltaX < -5) {
          emblaApi.scrollPrev();
          lastScrollTime.current = now;
        }
      }
    }
  }, [emblaApi]);

  useEffect(() => {
    const emblaNode = sectionRef.current; // Attach to section for broader reach
    if (!emblaNode) return;
    emblaNode.addEventListener("wheel", onWheel as any, { passive: true });
    return () => emblaNode.removeEventListener("wheel", onWheel as any);
  }, [onWheel]);

  /* ---------------- GSAP ANIMATIONS ---------------- */
  // 1. Initial Entry Animation (Title/Header only once)
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-hs-header]",
        { opacity: 0, y: 30 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          once: true
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // 2. Card Transition Animation (Only cards when type changes)
  useEffect(() => {
    if (loading || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".embla__slide",
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "expo.out",
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, activeType]);

  if (initialLoadDone && youtubeShorts.length === 0 && instaShorts.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="bg-[#282d63] py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ---------------- HEADER ---------------- */}
        <div data-hs-header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-[2px] bg-white/20" />
              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
                Watch & Learn
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              Latest Videos
            </h2>
          </div>

          <div className="flex flex-row items-center gap-3 w-full md:w-auto">
            {/* TYPE FILTERS */}
            <div className="relative flex-1 md:flex-none flex bg-white/5 p-1 md:p-1.5 rounded-xl md:rounded-2xl backdrop-blur-md border border-white/10">
              {/* Sliding Background Pill */}
              <div
                className="absolute top-1 md:top-1.5 bottom-1 md:bottom-1.5 bg-white rounded-lg md:rounded-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-xl"
                style={{ 
                  left: youtubeShorts.length > 0 && instaShorts.length > 0
                    ? (activeType === "insta" ? "calc(50% + 2px)" : "4px")
                    : "4px",
                  width: youtubeShorts.length > 0 && instaShorts.length > 0 ? "calc(50% - 6px)" : "calc(100% - 8px)"
                }}
              />

              {youtubeShorts.length > 0 && (
                <button
                  onClick={() => setActiveType("youtube")}
                  className={`relative flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-bold text-[10px] md:text-sm transition-colors duration-500 cursor-pointer z-10 ${activeType === "youtube" ? "text-[#0F172A]" : "text-white/60 hover:text-white"
                    }`}
                >
                  <Youtube size={14} className="md:w-[18px] md:h-[18px]" /> Shorts
                </button>
              )}
              {instaShorts.length > 0 && (
                <button
                  onClick={() => setActiveType("insta")}
                  className={`relative flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-bold text-[10px] md:text-sm transition-colors duration-500 cursor-pointer z-10 ${activeType === "insta" ? "text-[#0F172A]" : "text-white/60 hover:text-white"
                    }`}
                >
                  <Instagram size={14} className="md:w-[18px] md:h-[18px]" /> Reels
                </button>
              )}
            </div>

            {/* ACTION BUTTONS (Mobile: Show only active type icon) */}
            <div className="flex md:hidden items-center shrink-0">
              {activeType === "youtube" && youtubeShorts.length > 0 ? (
                <button className="w-10 h-10 bg-[#FF0000] text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all">
                  <Youtube size={20} />
                </button>
              ) : activeType === "insta" && instaShorts.length > 0 ? (
                <button className="w-10 h-10 bg-gradient-to-tr from-[#F58529] via-[#D62976] to-[#962FBF] text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all">
                  <Instagram size={20} />
                </button>
              ) : null}
            </div>

            {/* ACTION BUTTONS (Desktop: Show both with text) */}
            <div className="hidden md:flex items-center gap-4 justify-end">
              {youtubeShorts.length > 0 && (
                <button className="flex items-center gap-2 bg-[#FF0000] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:scale-105 transition-all cursor-pointer">
                  <Youtube size={16} /> Subscribe
                </button>
              )}
              {instaShorts.length > 0 && (
                <button className="flex items-center gap-2 bg-gradient-to-tr from-[#F58529] via-[#D62976] to-[#962FBF] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:scale-105 transition-all cursor-pointer">
                  <Instagram size={16} /> Follow
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ---------------- CAROUSEL ---------------- */}
        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex gap-6">
            {!initialLoadDone ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="embla__slide flex-[0_0_280px] min-w-0 bg-white/5 rounded-[2rem] aspect-[9/16] animate-pulse" />
              ))
            ) : (
              shorts.map((short) => (
                <div key={short.shorts_id} className="embla__slide flex-[0_0_280px] md:flex-[0_0_320px] min-w-0">
                  <a
                    href={short.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group relative aspect-[9/16] rounded-[2rem] overflow-hidden bg-white/5 cursor-pointer"
                  >
                    {/* THUMBNAIL */}
                    <img
                      src={short.thumbnail_image ? (short.thumbnail_image?.startsWith('http') ? short.thumbnail_image : base_url + short.thumbnail_image) : "/placeholder.png"}
                      alt={short.shorts_title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* OVERLAYS */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-80 group-hover:opacity-100 transition-opacity" />

                    {/* BADGES */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/10 uppercase tracking-wider">
                        {short.shorts_subtitle || "Project Showcase"}
                      </span>
                    </div>

                    {/* PLAY BUTTON */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform duration-500 border border-white/30 shadow-2xl">
                        <Play fill="white" size={24} />
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h4 className="text-white font-bold text-lg mb-0 line-clamp-2 leading-snug group-hover:text-white/90">
                        {short.shorts_title}
                      </h4>
                    </div>
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
