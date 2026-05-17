"use client";

import React, { useEffect, useRef } from "react";
import { ShieldCheck, Palette, PenTool, Infinity } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    title: "High Quality",
    description:
      "No compromises when it comes to quality. Every door is manufactured with precision and inspected for durability and finish before it reaches customers.",
    icon: ShieldCheck,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    title: "Premium Designs",
    description:
      "Doors that complement modern interiors while serving practical needs. Each design reflects a balance of clean aesthetics and structural reliability suitable for residential and commercial spaces.",
    icon: Palette,
    bg: "bg-orange-100",
    color: "text-orange-600",
  },
  {
    title: "Developed By Experts",
    description:
      "Masters of our services .We focus exclusively on PVC & uPVC door solutions, giving us deeper product knowledge and better quality control than any general supplier.",
    icon: PenTool,
    bg: "bg-indigo-100",
    color: "text-indigo-600",
  },
  {
    title: "Environment Friendly",
    description:
      "We understand the importance of protecting the environment we live in at all costs.Every service we provide is sustainably designed ensuring that there is no harm caused from our side to our environment.",
    icon: Infinity,
    bg: "bg-yellow-100",
    color: "text-yellow-600",
  },
];

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      /* HEADER */
      gsap.from("[data-why-header]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      });

      /* CARDS */
      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        opacity: 0,
        y: 24,
        scale: 0.96,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.15,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#fffaf2] py-10 md:py-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ---------------- HEADER ---------------- */}
        <div data-why-header className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Why Choose Us
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            At elbano, we value quality and competence. Every design we provide has precisely
            engineered imported ceramic tiles and roofing solutions that offer long-term performance.
          </p>
        </div>

        {/* ---------------- FEATURES ---------------- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-12 gap-3">
          {FEATURES.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className="flex flex-col items-start"
              >
                {/* ICON */}
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-lg ${item.bg} mb-4`}
                >
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>

                {/* TEXT */}
                <h4 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h4>

                <p className="text-gray-600 sm:text-sm text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
