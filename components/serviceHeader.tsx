"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import EnquiryModal from "./enquiryModal";

export default function ServiceHeader() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  /* ---------------- GSAP ANIMATION ---------------- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from(imageRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 1,
        delay: 0.15,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-white py-10 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* MOBILE REVERSE, DESKTOP NORMAL */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 md:gap-10 gap-16 items-center justify-center min-h-[80vh]">
          {/* ---------------- LEFT CONTENT ---------------- */}
          <div ref={contentRef} className="flex flex-col justify-center h-full">
            <p className="text-xs text-gray-500 mb-2">24×7 Service Support</p>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Door Systems That<br />
              Transform Interiors
            </h1>

            <div className="md:w-96 w-64 h-[1px] bg-gray-300 mb-4" />

            <p className="text-gray-600 text-sm md:text-base max-w-md leading-relaxed mb-6">
              With attention to quality and excellence we deliver door solutions that upgrade your way
              interiors and beautify your building spaces. Enter the world of premium door solutions with SS
              Enterprises
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-6 md:gap-10">
              <button
                onClick={() => setShowEnquiryModal(true)}
                className="bg-black cursor-pointer text-white md:px-8 px-6 py-2 rounded-full text-sm hover:bg-gray-800 transition"
              >
                Request Service
              </button>

              <a
                href="tel:+914832080456"
                className="flex items-center cursor-pointer gap-2 px-8 py-2 rounded-full border border-gray-300 text-sm hover:bg-gray-100 transition"
              >
                Contact Us Now
              </a>
            </div>
          </div>

          {/* ---------------- RIGHT IMAGE ---------------- */}
          <div
            ref={imageRef}
            className="relative flex justify-center lg:justify-end w-full"
          >
            {/* Yellow blob */}
            <div className="absolute w-[240px] h-[240px] md:w-[360px] md:h-[360px] bg-[#FFF1C9] rounded-full -z-10 right-4 top-1/2 -translate-y-1/2" />

            <Image
              src="/service_header.png"
              alt="Service Support"
              width={650}
              height={650}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
      <EnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        enquiryType={3}
      />
    </section>
  );
}
