"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /** ACTIVE CHECK
   * /blogs        → active
   * /blogs/12     → active
   */
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out flex items-center justify-between rounded-full border backdrop-blur-xl shadow-2xl ${scrolled
          ? "bg-white/90 w-[95%] max-w-6xl border-black/5 py-1 px-6 shadow-black/5"
          : "bg-white/10 w-[92%] max-w-5xl border-white/20 py-1.5 md:py-3 px-6 md:px-8"
          }`}
      >
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/logo-transparent.png"
            alt="logo"
            className={`transition-all duration-300 ${scrolled ? "h-5 md:h-8" : "h-6 md:h-9"} ${!scrolled && "brightness-0 invert"}`}
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[13px] font-bold tracking-tight transition-all duration-300 relative group ${scrolled ? "text-gray-700 hover:text-[#1e2b58]" : "text-white hover:text-white/80"
                }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1e2b58] transition-all duration-300 group-hover:w-full ${isActive(item.href) ? "w-full" : ""
                  }`}
              />
            </Link>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className={`hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-bold transition-all shadow-lg active:scale-95 ${scrolled
              ? "bg-[#1e2b58] text-white hover:bg-[#2a3c7a]"
              : "bg-white text-[#1e2b58] hover:bg-white/90"
              }`}
          >
            Get Quote
            <ArrowRight size={14} />
          </Link>

          {/* MOBILE MENU TOGGLE */}
          <button
            className={`md:hidden p-2 rounded-full transition-colors ${scrolled ? "hover:bg-gray-100" : "hover:bg-white/10"}`}
            onClick={() => setMobileOpen(true)}
          >
            <Menu
              className={`h-6 w-6 transition-colors duration-300 ${scrolled ? "text-gray-800" : "text-white"}`}
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
        className={`fixed top-0 right-0 h-full w-[85%] max-w-80 bg-white shadow-2xl z-[101] p-8 transform transition-transform duration-500 ease-in-out ${mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <img src="/logo-transparent.png" alt="logo" className="h-7" />
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* MOBILE NAV */}
        <nav className="flex flex-col gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`text-lg font-bold transition-colors ${isActive(item.href) ? "text-[#1e2b58]" : "text-gray-800"
                }`}
            >
              {item.label}
            </Link>
          ))}

          <hr className="my-2 border-gray-100" />

          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 bg-[#1e2b58] text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95"
          >
            Get Quote
            <ArrowRight size={18} />
          </Link>

          <a
            href="tel:+919995616166"
            className="flex items-center justify-center gap-3 text-gray-600 font-bold py-2 mt-4"
          >
            <Phone size={18} className="text-orange-500" />
            +91 999 561 6166
          </a>
        </nav>
      </div>
    </>
  );
}
