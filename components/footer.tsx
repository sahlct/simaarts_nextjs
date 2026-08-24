"use client";

import React, { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube
} from "lucide-react";
import Link from "next/link";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { useCompanyProfile } from "@/context/CompanyProfileContext";
import { getCategories } from "@/lib/api/category";
import { slugify } from "@/lib/slugify";

const Footer = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const { profile, links } = useCompanyProfile();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories(1, 4, "", 1);
        if (res?.data) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories for footer", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer className="bg-[#2C271D] text-white pt-20 pb-10 border-t border-[#D5C58A]/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand & About */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="SimaArts" className="h-10 object-contain" />
              <img src="/logo_text.png" alt="SimaArts" className="h-8 object-contain brightness-0 invert" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs font-medium">
              Premier manufacturer and supplier of official Scout & Guide embroidered badges, certified uniforms, scarves, belts, and insignia.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { icon: <Instagram size={18} />, href: profile.insta_url || "https://instagram.com" },
                { icon: <Facebook size={18} />, href: profile.facebook_url || "https://facebook.com" },
                { icon: <Mail size={18} />, href: links.mailto },
                { icon: <Youtube size={18} />, href: profile.youtube_url || "https://youtube.com" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-300 hover:text-[#D5C58A] hover:bg-white/10 hover:border-[#D5C58A]/40 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#D5C58A] mb-6">
              Products
            </h4>
            <ul className="flex flex-col gap-3.5">
              {categories.length > 0 ? (
                categories.map((item) => (
                  <li key={item.category_id}>
                    <Link href={`/products?category=${slugify(item.category_name)}`} className="text-gray-300 text-sm font-medium hover:text-[#D5C58A] transition-colors line-clamp-1">
                      {item.category_name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-sm">Loading...</li>
              )}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#D5C58A] mb-6">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3.5">
              {[
                { name: "Home", href: "/" },
                { name: "Products", href: "/products" },
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-300 text-sm font-medium hover:text-[#D5C58A] transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#D5C58A] mb-6">
              Get In Touch
            </h4>
            <ul className="flex flex-col gap-5">
              <li className="flex gap-3.5">
                <MapPin size={18} className="text-[#D5C58A] shrink-0 mt-0.5" />
                <a href={profile.location_url || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm leading-relaxed font-medium hover:text-[#D5C58A] transition-colors">
                  {profile.location_text || "SimaArts Scout & Guide Supplies, HQ India"}
                </a>
              </li>
              <li>
                <a href={links.tel} className="flex items-center gap-3.5 text-gray-300 text-sm font-medium hover:text-[#D5C58A] transition-colors">
                  <Phone size={18} className="text-[#D5C58A]" />
                  {profile.phone_number}
                </a>
              </li>
              <li>
                <a href={links.mailto} className="flex items-center gap-3.5 text-gray-300 text-sm font-medium hover:text-[#D5C58A] transition-colors">
                  <Mail size={18} className="text-[#D5C58A]" />
                  {profile.email}
                </a>
              </li>
              <li>
                <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 text-gray-300 text-sm font-medium hover:text-[#D5C58A] transition-colors">
                  <IconBrandWhatsapp size={18} className="text-[#D5C58A]" />
                  WhatsApp Inquiry
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs font-medium">
            © {new Date().getFullYear()} SimaArts. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/about" className="text-gray-400 text-xs font-medium hover:text-[#D5C58A] transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-400 text-xs font-medium hover:text-[#D5C58A] transition-colors">
              Contact Support
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

