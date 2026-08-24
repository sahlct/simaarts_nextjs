"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import { getTestimonials } from "@/lib/api/testimonial";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
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
  if (!loading && testimonials.length === 0) return null;

  return (
    <section ref={sectionRef} className="bg-[#FAF8F3] py-16 md:py-28 border-t border-[#EAE4D3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* HEADER */}
        <div data-ht-header className="text-center mb-12 md:mb-16 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-[1.5px] bg-[#8C7E4F]" />
            <span className="text-[10px] md:text-xs font-black tracking-[0.2em] text-[#8C7E4F] uppercase">
              Troop & School Reviews
            </span>
            <div className="w-10 h-[1.5px] bg-[#8C7E4F]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#2C271D] tracking-tight">
            What Leaders & Captains Say
          </h2>
        </div>

        {/* CAROUSEL */}
        <div className="relative group">
          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
              {testimonials.map((item) => (
                <div key={item.testimonial_id} className="embla__slide flex-[0_0_100%] lg:flex-[0_0_50%] min-w-0 px-4">
                  <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-[#EAE4D3] h-full flex flex-col justify-between hover:shadow-xl transition-all duration-500">

                    <div>
                      {/* STARS */}
                      <div className="flex gap-1 mb-5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill="#8C7E4F" className="text-[#8C7E4F]" />
                        ))}
                      </div>

                      {/* CONTENT */}
                      <p className="text-[#5A5243] text-base md:text-lg italic leading-relaxed mb-8 relative line-clamp-6 font-medium">
                        <span className="absolute -top-4 -left-3 text-6xl text-[#D5C58A]/30 font-serif select-none">“</span>
                        {item.content}
                      </p>
                    </div>

                    {/* USER INFO */}
                    <div className="flex items-center gap-4 pt-4 border-t border-[#EAE4D3]/50">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D5C58A]">
                        <img
                          src={item.image_of_candidate ? (item.image_of_candidate?.startsWith('http') ? item.image_of_candidate : base_url + item.image_of_candidate) : "/placeholder.png"}
                          alt={item.name_of_candidate}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-[#2C271D] font-bold text-base">{item.name_of_candidate}</h4>
                        <p className="text-[#857A68] text-xs font-semibold">{item.position_of_candidate}</p>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              onClick={scrollPrev}
              className="w-11 h-11 cursor-pointer rounded-full border border-[#D5C58A] bg-white flex items-center justify-center text-[#2C271D] hover:bg-[#D5C58A] transition-all duration-300 shadow-xs"
            >
              <ChevronLeft size={20} />
            </button>

            {/* DOTS */}
            <div className="flex items-center gap-2">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`transition-all duration-500 rounded-full ${index === selectedIndex
                    ? "w-8 h-2 bg-[#8C7E4F]"
                    : "w-2 h-2 bg-[#EAE4D3]"
                    }`}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              className="w-11 h-11 cursor-pointer rounded-full border border-[#D5C58A] bg-white flex items-center justify-center text-[#2C271D] hover:bg-[#D5C58A] transition-all duration-300 shadow-xs"
            >
              <ChevronRight size={20} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

