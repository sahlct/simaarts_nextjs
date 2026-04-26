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
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#1e2b58] p-1.5 rounded-lg">
              <span className="text-white font-bold text-xl px-1">E</span>
            </div>
            <span
              className={`font-bold text-2xl tracking-tight transition-colors duration-300 ${
                scrolled ? "text-[#1e2b58]" : "text-white"
              }`}
            >
              elbano
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-all duration-300 hover:text-[#1e2b58] relative group ${
                  scrolled ? "text-gray-700" : "text-white"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1e2b58] transition-all duration-300 group-hover:w-full ${
                    isActive(item.href) ? "w-full" : ""
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden md:flex items-center gap-2 bg-[#1e2b58] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2a3c7a] transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Get Quote
              <ArrowRight size={16} />
            </Link>

            {/* MOBILE MENU TOGGLE */}
            <button
              className="md:hidden p-2 rounded-lg"
              onClick={() => setMobileOpen(true)}
            >
              <Menu
                className={`h-7 w-7 transition-colors duration-300 ${
                  scrolled ? "text-gray-800" : "text-white"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[99]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[100] p-6 transform transition-transform duration-500 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            <div className="bg-[#1e2b58] p-1.5 rounded-lg">
              <span className="text-white font-bold text-lg px-1">E</span>
            </div>
            <span className="font-bold text-xl text-[#1e2b58]">elbano</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* MOBILE NAV */}
        <nav className="flex flex-col gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`text-lg font-semibold transition-colors ${
                isActive(item.href) ? "text-[#1e2b58]" : "text-gray-800"
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
            href="tel:+914832080456"
            className="flex items-center justify-center gap-3 text-gray-600 font-medium py-2"
          >
            <Phone size={18} className="text-orange-500" />
            +91 483 208 0456
          </a>
        </nav>
      </div>
    </header>
  );
}
