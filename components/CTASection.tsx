"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight, ShieldCheck, Award, Truck, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { CONTACT_LINKS } from "@/lib/contact";
import { IconBrandWhatsapp } from "@tabler/icons-react";

const CTASection = () => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".floating-shape", {
        y: "random(-15, 15)",
        x: "random(-15, 15)",
        rotation: "+=random(-10, 10)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.2,
          from: "random"
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative bg-[#3D3622] pt-20 md:pt-28 pb-14 md:pb-20 overflow-hidden text-[#FAF8F3]">
      {/* Floating Decorative Elements */}
      <div className="floating-shape absolute top-10 left-10 w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl rotate-12 border border-white/10 hidden md:block" />
      <div className="floating-shape absolute top-1/2 left-10 w-12 h-12 bg-white/5 backdrop-blur-md rounded-xl -rotate-12 border border-white/10 hidden md:block" />
      <div className="floating-shape absolute top-20 right-10 w-24 h-12 bg-white/5 backdrop-blur-md rounded-xl rotate-45 border border-white/10 hidden md:block" />
      <div className="floating-shape absolute top-1/2 right-10 w-20 h-16 bg-white/10 backdrop-blur-md rounded-2xl rotate-12 border border-white/10 hidden md:block" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-[2px] bg-[#D5C58A]" />
          <span className="text-[10px] md:text-xs font-black tracking-[0.25em] text-[#D5C58A] uppercase">
            Custom Orders & Bulk Supply
          </span>
          <div className="w-8 h-[2px] bg-[#D5C58A]" />
        </div>

        <h2 className="text-3xl md:text-6xl font-black text-white mb-6 leading-tight max-w-4xl tracking-tight">
          Need Custom Badges or <br className="hidden md:block" />
          <span className="text-[#D5C58A]">Bulk Troop Uniforms?</span>
        </h2>

        <p className="text-gray-300 text-sm md:text-lg leading-relaxed max-w-2xl mb-10 font-medium">
          SimaArts supplies official Scout & Guide badges, certified uniforms, scarves, belts, and insignia tailored to your school or district troop requirements.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 bg-[#D5C58A] text-[#2C271D] px-8 py-4 rounded-xl font-extrabold text-xs md:text-sm uppercase tracking-wider hover:bg-[#c4b377] transition-all w-full sm:w-auto shadow-xl shadow-black/20"
          >
            Request Custom Quote <ArrowRight size={18} />
          </Link>
          <a
            href={CONTACT_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-transparent border border-[#D5C58A]/40 text-white px-8 py-4 rounded-xl font-extrabold text-xs md:text-sm uppercase tracking-wider hover:bg-white/10 transition-all w-full sm:w-auto backdrop-blur-sm"
          >
            <IconBrandWhatsapp size={18} /> Instant WhatsApp Quote
          </a>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 w-full max-w-5xl mt-4 pt-8 border-t border-white/10">
          {[
            { label: "High-Precision Embroidery", icon: <Sparkles className="w-6 h-6 text-[#D5C58A]" /> },
            { label: "Official Standards Compliant", icon: <CheckCircle2 className="w-6 h-6 text-[#D5C58A]" /> },
            { label: "Nationwide Fast Shipping", icon: <Truck className="w-6 h-6 text-[#D5C58A]" /> },
            { label: "Bulk Troop Discounts", icon: <Award className="w-6 h-6 text-[#D5C58A]" /> },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                {feature.icon}
              </div>
              <span className="text-white text-xs md:text-sm font-bold text-center leading-snug">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;

