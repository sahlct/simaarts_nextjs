"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompanyProfile } from "@/context/CompanyProfileContext";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { profile, links } = useCompanyProfile();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed top-3 md:top-5 left-1/2 -translate-x-1/2 z-[90] transition-all duration-500 ease-in-out flex items-center justify-between rounded-full border shadow-xl ${scrolled
          ? "bg-[#FAF8F3]/95 backdrop-blur-md w-[95%] max-w-6xl border-[#D5C58A]/30 py-2 px-6 shadow-stone-900/5"
          : "bg-[#2C271D]/40 backdrop-blur-md w-[92%] max-w-5xl border-white/20 py-2 md:py-3.5 px-6 md:px-8"
          }`}
      >
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          {/* <img
            src="/logo.png"
            alt="SimaArts Logo"
            className={`transition-all duration-300 object-contain ${scrolled ? "h-8 md:h-10" : "h-9 md:h-11"}`}
          /> */}
          <img
            src={scrolled ? "/logo_text_black.png" : "/logo_text.png"}
            alt="SimaArts"
            className={`transition-all duration-300 object-contain ${scrolled ? "h-5 sm:h-6 md:h-7" : "h-6 sm:h-7 md:h-8"}`}
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[13px] font-extrabold uppercase tracking-wider transition-all duration-300 relative group ${scrolled ? "text-[#3D3622] hover:text-[#8C7E4F]" : "text-white hover:text-[#D5C58A]"
                }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-[#D5C58A] transition-all duration-300 group-hover:w-full ${isActive(item.href) ? "w-full" : "w-0"
                  }`}
              />
            </Link>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 ${scrolled
              ? "bg-[#D5C58A] text-[#2C271D] hover:bg-[#c4b377]"
              : "bg-white text-[#2C271D] hover:bg-[#FAF8F3]"
              }`}
          >
            Get Quote
            <ArrowRight size={14} />
          </Link>

          {/* MOBILE MENU TOGGLE */}
          <button
            className={`md:hidden p-2 rounded-full transition-colors ${scrolled ? "hover:bg-[#D5C58A]/20" : "hover:bg-white/10"}`}
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu
              className={`h-6 w-6 transition-colors duration-300 ${scrolled ? "text-[#2C271D]" : "text-white"}`}
            />
          </button>
        </div>
      </header>

      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-80 bg-[#FAF8F3] shadow-2xl z-[101] p-8 transform transition-transform duration-500 ease-in-out flex flex-col justify-between ${mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div>
          <div className="flex justify-between items-center mb-10 pb-4 border-b border-[#D5C58A]/30">
            <div className="flex items-center gap-2">
              {/* <img src="/logo_text.png" alt="SimaArts" className="h-8 object-contain" /> */}
              <img src="/logo_text_black.png" alt="SimaArts" className="h-6 object-contain" />
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 hover:bg-[#D5C58A]/20 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-[#2C271D]" />
            </button>
          </div>

          {/* MOBILE NAV */}
          <nav className="flex flex-col gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`text-base font-extrabold uppercase tracking-wider transition-colors ${isActive(item.href) ? "text-[#8C7E4F]" : "text-[#2C271D]"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-4 pt-6 border-t border-[#D5C58A]/30">
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 bg-[#D5C58A] text-[#2C271D] px-6 py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all shadow-md active:scale-95 w-full"
          >
            Get Quote
            <ArrowRight size={18} />
          </Link>

          <a
            href={links.tel}
            className="flex items-center justify-center gap-3 text-[#5A5243] font-bold text-sm py-2"
          >
            <Phone size={16} className="text-[#8C7E4F]" />
            {profile.phone_number}
          </a>
        </div>
      </div>
    </>
  );
}

