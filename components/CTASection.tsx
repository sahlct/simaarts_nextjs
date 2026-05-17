"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight, Droplet, Snowflake, Flame, Feather, Dumbbell, ShieldCheck, Truck, Headphones } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { CONTACT_LINKS } from "@/lib/contact";
import { IconBrandWhatsapp } from "@tabler/icons-react";

const CTASection = () => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".floating-shape", {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        rotation: "+=random(-15, 15)",
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
    <section ref={containerRef} className="relative bg-[#0F172A] pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden">
      {/* Floating Decorative Elements */}
      <div className="floating-shape absolute top-10 left-10 w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl rotate-12 border border-white/10 hidden md:block"></div>
      <div className="floating-shape absolute top-1/2 left-10 w-12 h-12 bg-white/5 backdrop-blur-md rounded-xl -rotate-12 border border-white/10 hidden md:block"></div>
      <div className="floating-shape absolute top-20 right-10 w-24 h-12 bg-white/5 backdrop-blur-md rounded-xl rotate-45 border border-white/10 hidden md:block"></div>
      <div className="floating-shape absolute top-1/2 right-10 w-20 h-16 bg-white/10 backdrop-blur-md rounded-2xl rotate-12 border border-white/10 hidden md:block"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center text-center">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-[2px] bg-[#EAB308]"></div>
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#EAB308] uppercase">
            Start Your Project
          </span>
          <div className="w-8 h-[2px] bg-[#EAB308]"></div>
        </div>

        <h2 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight max-w-4xl">
          Ready to Transform <br className="hidden md:block" />
          <span className="text-[#EAB308]">Your Space?</span>
        </h2>

        <p className="text-white/70 text-sm md:text-lg leading-relaxed max-w-2xl mb-12">
          Our design consultants will help you find the perfect imported ceramic tiles for
          your project. Request a personalised quote and free sample within 48 hours.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 bg-white text-[#1E2B4D] px-10 py-4 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all w-full sm:w-auto shadow-xl shadow-black/10"
          >
            Get Free Quote <ArrowRight size={18} />
          </Link>
          <a
            href={CONTACT_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-transparent border border-white/20 text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-white/10 transition-all w-full sm:w-auto backdrop-blur-sm"
          >
            <IconBrandWhatsapp size={18} /> WhatsApp Us
          </a>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 w-full max-w-6xl mt-8">
          {[
            { label: "Leak Proof", icon: <Droplet size={32} strokeWidth={1.5} className="md:w-10 md:h-10" /> },
            { label: "Frost Resistant", icon: <Snowflake size={32} strokeWidth={1.5} className="md:w-10 md:h-10" /> },
            { label: "Heat Resistant", icon: <Flame size={32} strokeWidth={1.5} className="md:w-10 md:h-10" /> },
            { label: "Light Weight", icon: <Feather size={32} strokeWidth={1.5} className="md:w-10 md:h-10" /> },
            { label: "Durable", icon: <Dumbbell size={32} strokeWidth={1.5} className="md:w-10 md:h-10" /> },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center gap-3 md:gap-4 w-[70px] md:w-[100px]">
              <div className="w-16 h-16 md:w-[84px] md:h-[84px] border-[2px] border-white rounded-xl md:rounded-2xl flex items-center justify-center text-white bg-transparent">
                {feature.icon}
              </div>
              <span className="text-white text-[11px] md:text-sm font-medium text-center leading-snug">
                {feature.label.split(' ').map((word, idx) => (
                  <React.Fragment key={idx}>
                    {word}
                    {idx !== feature.label.split(' ').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
