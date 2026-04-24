"use client";

import { useEffect, useRef, useState } from "react";
import { IconMessage } from "@tabler/icons-react";
import { gsap } from "gsap";
import EnquiryModal from "@/components/enquiryModal";

export default function HeroSection() {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLDivElement | null>(null);

  /* GSAP ANIMATION */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out" }
      );

      gsap.fromTo(
        imagesRef.current,
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", delay: 0.2 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-8 xl:py-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* IMAGES — ALWAYS TOP ON MOBILE */}
        <div
          ref={imagesRef}
          className="order-1 md:order-2 flex justify-start md:justify-end items-end gap-6 relative"
        >
          {/* MAIN IMAGE */}
          <img
            src="/with_door.png"
            alt="Main Door"
            className="w-[260px] md:w-[350px] rounded-2xl shadow-lg"
          />

          {/* SECOND IMAGE — DESKTOP */}
          <img
            src="/hero_01.png"
            alt="Detail Door"
            className="absolute right-0 -bottom-8 md:static md:w-[200px] md:h-[200px] w-[120px] h-[120px] object-cover rounded-xl shadow-md border"
          />

          {/* SECOND IMAGE — MOBILE */}
          {/* <img
            src="/hero_01.png"
            alt="Detail Door"
            className="md:hidden w-[120px] h-[120px] object-cover rounded-xl shadow-md border self-end"
          /> */}
        </div>

        {/* CONTENT */}
        <div
          ref={contentRef}
          className="order-2 md:order-1 flex flex-col"
        >
          <h5 className="text-md md:text-lg text-yellow-600 font-lighter text-gray-900 leading-tight">
            Premium PVC & uPVC Doors
          </h5>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            Door Solutions That<br /> Define Elegance
          </h1>

          <div className="mt-5 w-[75%] h-[1.5px] bg-gray-300" />

          <p className="text-gray-600 mt-5 max-w-md leading-relaxed">
            We bring to you premium PVC and uPVC doors engineered to withstand moisture and resist
            pests. Made without the use of traditional timber, experience a perfect balance of sustainability
            and durability in every product you own.
          </p>

          <button
            onClick={() => setShowEnquiryModal(true)}
            className="mt-8 cursor-pointer w-fit inline-flex items-center gap-2 bg-gray-900 text-white px-10 py-2 rounded-full shadow hover:bg-black transition"
          >
            <IconMessage size={18} />
            Connect With Us Now
          </button>
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
