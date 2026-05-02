"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import { getTestimonials } from "@/lib/api/testimonial";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";

interface Testimonial {
  testimonial_id: number;
  name_of_candidate: string;
  position_of_candidate: string;
  image_of_candidate: string;
  content: string;
}

export default function HomeTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 1024px)": { slidesToScroll: 2 },
    },
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, setScrollSnaps, onSelect]);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTestimonials(1, 10, "", { status: "1" });
        setTestimonials(res?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ---------------- GSAP ANIMATION ---------------- */
  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo("[data-ht-header]",
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
        }
      );

      gsap.fromTo(".embla__viewport",
        { opacity: 0, scale: 0.95 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "expo.out",
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  if (loading) return null;

  return (
    <section ref={sectionRef} className="bg-[#FAFAFA] py-12 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ---------------- HEADER ---------------- */}
        <div data-ht-header className="text-center mb-10 md:mb-16 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-[1.5px] bg-[#1E2B4D]" />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#1E2B4D] uppercase">
              Client Reviews
            </span>
            <div className="w-10 h-[1.5px] bg-[#1E2B4D]" />
          </div>
          <h2 className="text-3xl md:text-6xl font-black text-[#0F172A] tracking-tight">
            What Our Clients Say
          </h2>
        </div>

        {/* ---------------- CAROUSEL ---------------- */}
        <div className="relative group">
          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
              {testimonials.map((item) => (
                <div key={item.testimonial_id} className="embla__slide flex-[0_0_100%] lg:flex-[0_0_50%] min-w-0 px-4">
                  <div className="bg-white rounded-[2rem] p-6 md:p-12 shadow-[0_10px_50px_rgba(0,0,0,0.03)] border border-gray-100 h-full flex flex-col justify-between hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all duration-500 group/card">

                    <div>
                      {/* STARS */}
                      <div className="flex gap-1 mb-5 md:mb-8">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill="#1E2B4D" className="text-[#1E2B4D]" />
                        ))}
                      </div>

                      {/* CONTENT */}
                      <p className="text-gray-600 text-base md:text-xl italic leading-relaxed mb-6 md:mb-10 relative">
                        <span className="absolute -top-4 -left-4 text-6xl text-[#1E2B4D]/5 font-serif select-none">“</span>
                        {item.content}
                      </p>
                    </div>

                    {/* USER INFO */}
                    <div className="flex items-center gap-5">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#1E2B4D]/10">
                        <img
                          src={item.image_of_candidate ? base_url + item.image_of_candidate : "/placeholder.png"}
                          alt={item.name_of_candidate}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-[#0F172A] font-bold text-lg">{item.name_of_candidate}</h4>
                        <p className="text-gray-400 text-sm font-medium">{item.position_of_candidate}</p>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---------------- NAVIGATION ---------------- */}
          <div className="flex items-center justify-center gap-8 mt-10 md:mt-16">
            <button
              onClick={scrollPrev}
              className="w-12 h-12 cursor-pointer rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#1E2B4D] hover:border-[#1E2B4D] transition-all duration-300"
            >
              <ChevronLeft size={24} />
            </button>

            {/* DOTS */}
            <div className="flex items-center gap-3">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`transition-all duration-500 rounded-full ${index === selectedIndex
                    ? "w-8 h-2 bg-[#1E2B4D]"
                    : "w-2 h-2 bg-gray-300"
                    }`}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              className="w-12 h-12 cursor-pointer rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#1E2B4D] hover:border-[#1E2B4D] transition-all duration-300"
            >
              <ChevronRight size={24} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
