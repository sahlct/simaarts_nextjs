"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function HomeAbout() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const yearsRef = useRef<HTMLSpanElement>(null);
  const itemsRef = useRef<HTMLSpanElement>(null);
  const troopsRef = useRef<HTMLSpanElement>(null);

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 2.2;

          const animateCounter = (ref: HTMLElement | null, end: number) => {
            if (!ref) return;

            gsap.fromTo(
              ref,
              { innerHTML: 0 },
              {
                innerHTML: end,
                duration,
                ease: "power2.out",
                snap: { innerHTML: 1 },
              }
            );
          };

          animateCounter(yearsRef.current, 25);
          animateCounter(itemsRef.current, 1000);
          animateCounter(troopsRef.current, 500);

          observer.disconnect();
        }
      },
      {
        threshold: 0.4,
      }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#FAF8F3] border-y border-[#EAE4D3] py-12 md:py-20 px-6"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 md:gap-10 gap-6 items-center justify-between">

        {/* LEFT CONTENT */}
        <div className="md:col-span-6">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#8C7E4F] mb-2 block">
            Our Legacy & Tradition
          </span>

          <h2 className="text-3xl md:text-5xl font-black text-[#2C271D] leading-tight">
            SimaArts <span className="text-[#8C7E4F]">Scout & Guide Supplies</span>
          </h2>

          <p className="text-[#5A5243] mt-4 leading-relaxed max-w-xl text-sm md:text-base font-medium">
            SimaArts is dedicated to crafting high-precision embroidered badges, certified uniforms, scarves, caps, belts, and insignia for Scouts, Guides, and Educational Institutions across India. We deliver authentic, durable, and standard-compliant equipment for every scout troop.
          </p>
        </div>

        {/* SPACER */}
        <div className="md:col-span-1" />

        {/* COUNTERS */}
        <div className="md:col-span-5 flex flex-wrap md:flex-nowrap items-center justify-between gap-6 md:gap-4 bg-white p-6 md:p-8 rounded-[2rem] border border-[#EAE4D3] shadow-xs">

          {/* YEARS */}
          <div className="text-center md:text-left">
            <div className="text-2xl md:text-4xl font-black text-[#4A4229]">
              <span ref={yearsRef}>0</span>+
            </div>
            <p className="text-[#857A68] text-xs font-extrabold mt-1 uppercase tracking-wider">
              Years Craftsmanship
            </p>
          </div>

          <div className="hidden md:block w-[1px] bg-[#EAE4D3] h-12" />

          {/* ITEMS */}
          <div className="text-center md:text-left">
            <div className="text-2xl md:text-4xl font-black text-[#4A4229]">
              <span ref={itemsRef}>0</span>+
            </div>
            <p className="text-[#857A68] text-xs font-extrabold mt-1 uppercase tracking-wider">
              Product Types
            </p>
          </div>

          <div className="hidden md:block w-[1px] bg-[#EAE4D3] h-12" />

          {/* TROOPS */}
          <div className="text-center md:text-left">
            <div className="text-2xl md:text-4xl font-black text-[#4A4229]">
              <span ref={troopsRef}>0</span>+
            </div>
            <p className="text-[#857A68] text-xs font-extrabold mt-1 uppercase tracking-wider">
              Troops Supplied
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

