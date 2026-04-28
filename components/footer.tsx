"use client";

import React from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { IconBrandWhatsapp } from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="bg-[#1E2B4D] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand & About */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                <span className="text-xl font-black text-white italic">E</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight">elbano</h3>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Crafting timeless roofing excellence with premium natural clay tiles since 1995.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { icon: <Instagram size={18} />, href: "#" },
                { icon: <Facebook size={18} />, href: "#" },
                { icon: <Linkedin size={18} />, href: "#" },
                { icon: <Youtube size={18} />, href: "#" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-8">
              Products
            </h4>
            <ul className="flex flex-col gap-4">
              {[
                "Spanish Tiles",
                "Flat Tiles",
                "Curved Tiles",
                "Accessories",
                "New Arrivals"
              ].map((item) => (
                <li key={item}>
                  <Link href={`/products/${item.toLowerCase().replace(" ", "-")}`} className="text-white/60 text-sm hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-8">
              Company
            </h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: "Our Projects", href: "/projects" },
                { name: "About Us", href: "/about" },
                { name: "Services", href: "/services" },
                { name: "Contact", href: "/contact" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/60 text-sm hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-8">
              Contact
            </h4>
            <ul className="flex flex-col gap-6">
              <li className="flex gap-4">
                <MapPin size={18} className="text-white/40 shrink-0" />
                <span className="text-white/60 text-sm leading-relaxed">
                  14 Via della Ceramica, Florence, Italy 50121
                </span>
              </li>
              <li>
                <a href="tel:+390551234567" className="flex items-center gap-4 text-white/60 text-sm hover:text-white transition-colors">
                  <Phone size={18} className="text-white/40" />
                  +39 055 123 4567
                </a>
              </li>
              <li>
                <a href="mailto:info@elbano.com" className="flex items-center gap-4 text-white/60 text-sm hover:text-white transition-colors">
                  <Mail size={18} className="text-white/40" />
                  info@elbano.com
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-4 text-white/60 text-sm hover:text-white transition-colors">
                  <IconBrandWhatsapp size={18} className="text-white/40" />
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-[10px] md:text-xs font-medium">
            © 2024 Elbano. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-white/40 text-[10px] md:text-xs font-medium hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/40 text-[10px] md:text-xs font-medium hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
