"use client";

import React from "react";
import Image from "next/image";

const PRODUCTS = [
  "/door_1.png",
  "/door_2.png",
  "/door_3.png",
  "/door_4.png",
];

export default function BrandsSlider() {
  return (
    <section className="py-10 md:py-14 bg-white pb-0">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* SECTION TITLE */}
        <h2 className="text-xl md:text-3xl font-semibold text-gray-900 mb-4">
          Popular Brands
        </h2>

        {/* GRADIENT CONTAINER */}
        <div className="rounded-2xl bg-gradient-to-r from-[#e07b00] to-[#fbb400] px-6 py-8 md:px-10 md:py-12 flex flex-col lg:flex-row items-start justify-between gap-10">
          {/* LEFT CONTENT */}
          <div className="text-white max-w-lg flex flex-col justify-start">
            <h3 className="text-2xl md:text-3xl font-bold tracking-wide mb-4">
              DORWIN
            </h3>

            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              Real achievements that define our commitment to quality,
              precision, and long-term trust. Each milestone reflects our
              dedication to excellence and our passion for delivering results
              that truly make a difference in our customers’ lives.
            </p>
          </div>

          {/* RIGHT PRODUCT STACK */}
          <div className="flex items-center overflow-x-auto scrollbar-hide pl-4 md:mt-48">
            {PRODUCTS.map((img, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl
                 w-[92px] md:w-[100px]
                 h-[92px] md:h-[100px]
                 flex items-center justify-center
                 shadow-sm
                 -ml-3 first:ml-0"
                style={{ zIndex: PRODUCTS.length - index }}
              >
                <div className="relative w-[48px] md:w-[52px] h-[70px] md:h-[78px]">
                  <Image
                    src={img}
                    alt={`Door ${index + 1}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            ))}

            {/* +100 ITEMS CARD */}
            <div
              className="relative bg-white rounded-2xl
               w-[92px] md:w-[100px]
               h-[92px] md:h-[100px]
               flex flex-col items-center justify-center
               text-center shadow-sm
               -ml-3"
              style={{ zIndex: 0 }}
            >
              <span className="text-2xl font-bold text-orange-600 leading-none">
                +
              </span>
              <span className="text-[11px] font-semibold text-gray-800">
                100+ Items
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
