"use client";

import React, { useEffect, useState } from "react";
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
import { CONTACT_INFO, CONTACT_LINKS } from "@/lib/contact";
import { getProducts } from "@/lib/api/product";
import { slugify } from "@/lib/api/slugify";

const Footer = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts(1, 5);
        if (res?.data) {
          setProducts(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch products for footer", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <footer className="bg-[#282d63] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

          {/* Brand & About */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo-transparent.png" alt="logo" className="max-h-10 brightness-0 invert" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Crafting timeless roofing excellence with premium natural clay tiles since 1995.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { icon: <Instagram size={18} />, href: CONTACT_INFO.instagram },
                { icon: <Facebook size={18} />, href: CONTACT_INFO.facebook },
                { icon: <Mail size={18} />, href: CONTACT_LINKS.mailto },
                { icon: <Youtube size={18} />, href: CONTACT_INFO.youtube },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
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
              {products.length > 0 ? (
                products.map((item) => (
                  <li key={item.product_id}>
                    <Link href={`/products/${slugify(item.product_name)}`} className="text-white/60 text-sm hover:text-white transition-colors line-clamp-1">
                      {item.product_name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-white/40 text-sm">Loading...</li>
              )}
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
                <a href={CONTACT_INFO.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-white/60 text-sm leading-relaxed hover:text-white transition-colors">
                  Elbano Roofings, Airport Road, Karuvankallu, Malappuram. <br />Pin : 673638
                </a>
              </li>
              <li>
                <a href={CONTACT_LINKS.tel} className="flex items-center gap-4 text-white/60 text-sm hover:text-white transition-colors">
                  <Phone size={18} className="text-white/40" />
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li>
                <a href={CONTACT_LINKS.mailto} className="flex items-center gap-4 text-white/60 text-sm hover:text-white transition-colors">
                  <Mail size={18} className="text-white/40" />
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a href={CONTACT_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/60 text-sm hover:text-white transition-colors">
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
            © {new Date().getFullYear()} elbano. All rights reserved.
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
