"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getServices } from "@/lib/api/service";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Service {
  service_id: number;
  service_title: string;
  service_description: string;
  service_image: string;
}

export default function OurServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const loadServices = async () => {
      try {
        // Fetch up to 6 services
        const res = await getServices(1, 6, "", 1);
        setServices(res?.data || []);
        if (res?.total) setTotal(res.total);
      } catch (error) {
        console.error("Service fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  /* ---------------- GSAP ANIMATION ---------------- */
  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo("[data-os-title]", 
        { opacity: 0, y: 24 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "all"
        }
      );

      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length > 0) {
        gsap.fromTo(validCards, 
          { opacity: 0, y: 100 },
          {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            },
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: "expo.out",
            clearProps: "all"
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, services]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-b from-[#FAFAFA] to-[#F1F5F9] py-20 md:py-32 overflow-hidden"
    >
      {/* Decorative top-right element */}
      <div className="absolute top-10 right-10 w-48 h-32 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl -rotate-6 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* ---------------- HEADER ---------------- */}
        <div data-os-title className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-[2px] bg-[#1E2B4D]" />
              <span className="text-xs font-bold tracking-[0.2em] text-[#1E2B4D] uppercase">
                WHAT WE DO
              </span>
              <div className="w-10 h-[2px] bg-[#1E2B4D]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight">
              Our Services
            </h2>
          </div>
          <div className="max-w-md md:text-right">
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              From sourcing the world's finest ceramic tiles to expert installation and aftercare — we handle every stage of your project.
            </p>
          </div>
        </div>

        {/* ---------------- GRID ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          
          {/* ----------- SKELETON ----------- */}
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-sm h-96">
                <div className="h-48 bg-gray-200" />
                <div className="p-6">
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}

          {/* ----------- REAL DATA ----------- */}
          {!loading &&
            services.map((service, index) => {
              const image = service.service_image
                ? (service.service_image?.startsWith('http') ? service.service_image : base_url + service.service_image)
                : "/placeholder.png";

              return (
                <div
                  key={service.service_id}
                  ref={(el) => {
                    if (el) cardsRef.current[index] = el;
                  }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#1E2B4D]/5 border border-gray-100 group transition-all duration-300"
                >
                  {/* Image Container */}
                  <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                    <img
                      src={image}
                      alt={service.service_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Icon Badge */}
                    <div className="absolute top-4 left-4 bg-[#1E2B4D] w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-[#1E2B4D] transition-colors">
                      {service.service_title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {service.service_description}
                    </p>

                    {/* Badges (Mock styling for design parity) */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      <span className="px-3 py-1.5 bg-[#F1F5F9] text-[#475569] text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Premium Quality
                      </span>
                      <span className="px-3 py-1.5 bg-[#F1F5F9] text-[#475569] text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Expert Support
                      </span>
                    </div>

                    {/* Link removed as per user request */}
                  </div>
                </div>
              );
            })}
        </div>

        {/* ---------------- VIEW ALL BUTTON ---------------- */}
        {total > 6 && (
          <div className="mt-16 flex justify-center">
            <Link
              href="/services"
              className="bg-[#1E2B4D] text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-[#0F172A] hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-[#1E2B4D]/20"
            >
              View All Services
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
