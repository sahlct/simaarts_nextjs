"use client";

import React, { useEffect, useRef } from "react";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { gsap } from "gsap";
import { useCompanyProfile } from "@/context/CompanyProfileContext";

const WhatsAppWidget = () => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const { links } = useCompanyProfile();

  useEffect(() => {
    if (buttonRef.current) {
      // Entrance animation
      gsap.fromTo(
        buttonRef.current,
        { scale: 0, opacity: 0, y: 20 },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: "elastic.out(1, 0.5)",
          delay: 1.5 
        }
      );
    }
  }, []);

  return (
    <a
      ref={buttonRef}
      href={links.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[9999] flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)] transition-all duration-300 group scale-100 hover:scale-110 active:scale-95"
      aria-label="Contact us on WhatsApp"
    >
      {/* Ripple effect background */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-30" />
      
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
      
      {/* WhatsApp Icon */}
      <IconBrandWhatsapp size={24} className="md:hidden relative z-10 transition-transform duration-300 group-hover:rotate-12" stroke={2} />
      <IconBrandWhatsapp size={32} className="hidden md:block relative z-10 transition-transform duration-300 group-hover:rotate-12" stroke={2} />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-5 bg-white text-[#1E2B4D] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-2xl opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 whitespace-nowrap border border-black/5 flex items-center gap-2">
        <div className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
        Connect with us
      </div>
    </a>
  );
};

export default WhatsAppWidget;
