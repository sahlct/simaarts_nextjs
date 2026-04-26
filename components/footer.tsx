"use client";

import Image from "next/image";
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { IconBrandWhatsapp } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#12160f] to-[#1b2018] text-white">
      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* ---------------- LEFT : BRAND ---------------- */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/ss_logo_only.png"
                alt="SS Enterprises"
                width={40}
                height={40}
                className="object-contain"
              />
              <h3 className="text-3xl font-bold">SS Enterprises</h3>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed mb-6 max-w-sm">
              Building trust through quality craftsmanship and innovative
              solutions. We are dedicated to delivering excellence in every
              project we undertake.
            </p>

            {/* social media icons */}
            <h4 className="text-sm font-semibold text-yellow-400 mb-4">
              We are Available on
            </h4>
            <div className="flex gap-3 mt-6 items-center">
              <a href="https://www.instagram.com/SSEnterprises" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-6 h-6 text-white" />
              </a>
              <a href="https://wa.me/914832080456" target="_blank" rel="noopener noreferrer">
                <IconBrandWhatsapp className="w-6 h-6 text-white" />
              </a>
              <a href="https://www.facebook.com/SSEnterprises" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-6 h-6 text-white" />
              </a>
              <a href="tel:+914832080456" target="_blank" rel="noopener noreferrer">
                <Phone className="w-6 h-6 text-white" />
              </a>
            </div>

            {/* <a
              href="/brochure.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white cursor-pointer text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition"
            >
              Download Catalogue
            </a> */}
          </div>

          {/* ---------------- CENTER : QUICK LINKS ---------------- */}
          <div>
            <h4 className="text-sm font-semibold text-yellow-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="hover:text-white cursor-pointer">
                <Link href="/about">About Us </Link>
              </li>
              <li className="hover:text-white cursor-pointer">
                <Link href="/contact">Contact Us </Link>
              </li>
              <li className="hover:text-white cursor-pointer">
                <Link href="/careers">Career </Link>
              </li>
              <li className="hover:text-white cursor-pointer">
                <Link href="/services">Services </Link>
              </li>
              <li className="hover:text-white cursor-pointer">
                <Link href="/products">Products </Link>
              </li>
            </ul>
          </div>

          {/* ---------------- RIGHT : CONTACT ---------------- */}
          <div>
            <h4 className="text-sm font-semibold text-yellow-400 mb-4">
              Get in Touch
            </h4>

            <ul className="space-y-4 text-sm text-gray-300">
              {/* LOCATION */}
              <li>
                <a
                  href="https://maps.app.goo.gl/akzNBpKVM6p5WjPW9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 hover:text-white transition"
                >
                  <MapPin className="md:w-4 md:h-4 text-yellow-400 mt-1 shrink-0" />
                  <span>
                    34B, Inkel Greens, Karathode Gorakam Melmuri PO, Malappuram
                    Kerala - 676 519
                  </span>
                </a>
              </li>

              {/* PHONE */}
              <li>
                <a
                  href="tel:+914832080456"
                  className="flex items-center gap-3 hover:text-white transition"
                >
                  <Phone className="w-4 h-4 text-yellow-400" />
                  <span>+91 483 208 0456</span>
                </a>
              </li>

              {/* EMAIL */}
              <li>
                <a
                  href="mailto:info@ssemlp.com"
                  className="flex items-center gap-3 hover:text-white transition"
                >
                  <Mail className="w-4 h-4 text-yellow-400" />
                  <span>info@ssemlp.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ---------------- BOTTOM BAR ---------------- */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-xs text-gray-400">
          © 2026 SS Enterprises. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
