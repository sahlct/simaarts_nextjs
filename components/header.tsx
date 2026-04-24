"use client";

import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", href: "/public/home" },
  { label: "About", href: "/public/about" },
  { label: "Products", href: "/public/products" },
  { label: "Services", href: "/public/services" },
  { label: "Blogs", href: "/public/blogs" },
  { label: "Careers", href: "/public/careers" },
  { label: "Contact", href: "/public/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  /** ACTIVE CHECK
   * /public/blogs        → active
   * /public/blogs/12     → active
   */
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link href="/public/home">
            <img
              src="/ss_logo.png"
              alt="SS Enterprises"
              className="md:h-9 h-7 cursor-pointer"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 font-medium">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition ${
                  isActive(item.href)
                    ? "text-orange-500 font-semibold"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP PHONE */}
          <a
            href="tel:+914832080456"
            className="hidden md:flex items-center gap-4 text-gray-900 font-semibold ps-3 rounded-full border border-gray-200 hover:border-gray-300 transition"
          >
            <span>+91 483 208 0456</span>
            <div className="bg-yellow-400 rounded-full p-2">
              <Phone className="w-4 h-4 text-white" />
            </div>
          </a>

          {/* MOBILE MENU */}
          <button className="md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-7 w-7 text-gray-800" />
          </button>
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
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-[100] p-6 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <img src="/ss_logo.png" alt="SS Enterprises" className="h-7" />
          <button onClick={() => setMobileOpen(false)}>
            <X className="h-7 w-7 text-gray-700" />
          </button>
        </div>

        {/* MOBILE NAV */}
        <nav className="flex flex-col gap-4 font-medium">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`transition ${
                isActive(item.href)
                  ? "text-orange-500 font-semibold"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* MOBILE PHONE */}
          <a
            href="tel:+914832080456"
            className="mt-6 flex items-center gap-2 font-semibold text-gray-900"
          >
            <Phone className="w-4 h-4 text-orange-500" />
            +91 483 208 0456
          </a>
        </nav>
      </div>
    </header>
  );
}
