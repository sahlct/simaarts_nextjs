"use client";

import React from "react";
import { ArrowRight, Phone, ShieldCheck, Truck, Headphones } from "lucide-react";
import Link from "next/link";
import { CONTACT_LINKS } from "@/lib/contact";
import { IconBrandWhatsapp } from "@tabler/icons-react";

const CTASection = () => {
  return (
    <section className="relative bg-[#1E2B4D] py-24 md:py-32 overflow-hidden">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl rotate-12 border border-white/10 hidden md:block"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/5 backdrop-blur-md rounded-xl -rotate-12 border border-white/10 hidden md:block"></div>
      <div className="absolute top-20 right-10 w-24 h-12 bg-white/5 backdrop-blur-md rounded-xl rotate-45 border border-white/10 hidden md:block"></div>
      <div className="absolute bottom-10 right-1/4 w-20 h-16 bg-white/10 backdrop-blur-md rounded-2xl rotate-12 border border-white/10 hidden md:block"></div>

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
        <div className="grid grid-cols-3 gap-2 md:gap-24">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center text-[#EAB308] backdrop-blur-md">
              <ShieldCheck size={20} className="md:w-6 md:h-6" />
            </div>
            <span className="text-white/60 text-[8px] md:text-xs font-bold tracking-wider uppercase">
              10 Year Warranty
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center text-[#EAB308] backdrop-blur-md">
              <Truck size={20} className="md:w-6 md:h-6" />
            </div>
            <span className="text-white/60 text-[8px] md:text-xs font-bold tracking-wider uppercase">
              Delivery Available
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center text-[#EAB308] backdrop-blur-md">
              <Headphones size={20} className="md:w-6 md:h-6" />
            </div>
            <span className="text-white/60 text-[8px] md:text-xs font-bold tracking-wider uppercase">
              Expert Support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
