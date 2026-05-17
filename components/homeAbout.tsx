"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function HomeAbout() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const yearsRef = useRef<HTMLSpanElement>(null);
  const clientsRef = useRef<HTMLSpanElement>(null);
  const projectsRef = useRef<HTMLSpanElement>(null);

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

          animateCounter(yearsRef.current, 13);
          animateCounter(clientsRef.current, 18);
          animateCounter(projectsRef.current, 98);

          observer.disconnect(); // animate only once
        }
      },
      {
        threshold: 0.4, // 40% visible before triggering
      }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#fefbf6] py-8 md:py-16 px-6"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 md:gap-10 gap-5 items-center justify-between">

        {/* LEFT CONTENT */}
        <div className="md:col-span-5">
          <h4 className="text-2xl md:text-4xl font-semibold text-yellow-600">
            Our Story
          </h4>

          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mt-1">
            elbano
          </h2>

          <p className="text-gray-600 mt-4 leading-relaxed max-w-md">
            elbano was born on 18th February 2017 with the aim of delivering budget-friendly and
            premium imported ceramic tiles and roofing solutions. With sustainability in mind, we intend to
            offer a smarter, greener, and more durable alternative to today's homeowners.
          </p>
        </div>

        {/* SPACER */}
        <div className="md:col-span-2"></div>

        {/* COUNTERS */}
        <div className="md:col-span-5 flex flex-wrap md:flex-nowrap items-center justify-between gap-10 md:gap-6">

          {/* YEARS */}
          <div className="text-center md:text-left">
            <div className="text-2xl md:text-4xl font-bold text-gray-900">
              <span ref={yearsRef}>0</span>+
            </div>
            <p className="text-gray-500 sm:text-sm text-xs mt-1">
              Years of <br /> Craftsmanship
            </p>
          </div>

          <div className="hidden md:block w-[1px] bg-gray-300 h-12" />

          {/* CLIENTS */}
          <div className="text-center md:text-left">
            <div className="text-2xl md:text-4xl font-bold text-gray-900">
              <span ref={clientsRef}>0</span>+
            </div>
            <p className="text-gray-500 sm:text-sm text-xs mt-1">
              Happy <br /> Clients
            </p>
          </div>

          <div className="hidden md:block w-[1px] bg-gray-300 h-12" />

          {/* PROJECTS */}
          <div className="text-center md:text-left">
            <div className="text-2xl md:text-4xl font-bold text-gray-900">
              <span ref={projectsRef}>0</span>+
            </div>
            <p className="text-gray-500 sm:text-sm text-xs mt-1">
              Projects <br /> Completed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
