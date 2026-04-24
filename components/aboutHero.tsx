"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import EnquiryModal from "./enquiryModal";

const STATS = [
  { label: "Years of Craftsmanship", value: 13, suffix: "+" },
  { label: "Happy Clients", value: 18, suffix: "+" },
  { label: "Projects Completed", value: 98, suffix: "+" },
];

export default function AboutHero() {
  const [counts, setCounts] = useState(STATS.map(() => 0));
  const startedRef = useRef(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  /* ---------------- COUNTER ANIMATION ---------------- */
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const duration = 1500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setCounts(STATS.map((stat) => Math.floor(stat.value * progress)));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <section className="bg-white py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 min-h-[80vh] flex">
        {/* ---------------- MAIN LAYOUT ---------------- */}
        <div className="w-full flex flex-col-reverse lg:grid lg:grid-cols-2 md:gap-10 gap-5 items-center">
          {/* ---------------- LEFT CONTENT (BOTTOM ON MOBILE) ---------------- */}
          <div className="flex flex-col justify-center lg:mt-32 h-full">
            <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4">
              About <br />
              SS Enterprises
            </h1>

            <div className="w-16 h-[2px] bg-gray-300 mb-4" />

            <p className="text-gray-600 text-sm md:text-base max-w-md leading-relaxed mb-6">
              We specialize in manufacturing premium quality fiber doors with a
              perfect blend of elegance, strength, and durability. Every product
              we craft reflects our commitment to excellence and innovation.
            </p>

            <button
              onClick={() => setShowEnquiryModal(true)}
              className="bg-black cursor-pointer w-fit text-white px-10 py-2 rounded-full text-sm hover:bg-gray-800 transition"
            >
              Talk to Us
            </button>
          </div>

          {/* ---------------- RIGHT IMAGE (TOP ON MOBILE) ---------------- */}
          <div className="relative flex flex-col justify-center lg:mt-32 lg:justify-end w-full">
            <div className="w-full flex justify-center">
              <Image
                src="/door_three.png"
                alt="SS Enterprises Doors"
                width={500}
                height={500}
                className="object-contain"
                priority
              />
            </div>

            {/* ---------------- STATS ---------------- */}
            <div className="border-t border-gray-200 mt-4">
              <div className="grid grid-cols-3 text-center">
                {STATS.map((stat, index) => (
                  <div
                    key={index}
                    className="py-6 px-2 border-r last:border-r-0 border-gray-200"
                  >
                    <p className="text-xl lg:text-5xl font-semibold text-gray-900">
                      {counts[index]}
                      {stat.suffix}
                    </p>
                    <p className="sm:text-sm text-xs text-gray-600 mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <EnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        enquiryType={1}
      />
    </section>
  );
}
