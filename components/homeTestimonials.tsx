"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  getTestimonials,
  getTestimonialById,
} from "@/lib/api/testimonial";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  testimonial_id: number;
  name_of_candidate: string;
  position_of_candidate: string;
  image_of_candidate: string;
  content: string;
}

export default function HomeTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const router = useRouter();

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  /* ---------------- LOAD TESTIMONIALS ---------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTestimonials(1, 3, "", { status: "1" });
        setTestimonials(res?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ---------------- GSAP FIXED ANIMATION ---------------- */
  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const cards = cardsRef.current.filter(Boolean);

    // SAFETY: ensure visible
    gsap.set(cards, { opacity: 1, y: 0 });
    gsap.set("[data-ht-title]", { opacity: 1, y: 0 });
    gsap.set("[data-ht-cta]", { opacity: 1, y: 0 });

    const ctx = gsap.context(() => {
      // TITLE
      gsap.fromTo(
        "[data-ht-title]",
        { opacity: 0, y: 30 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        }
      );

      // CARDS
      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
        }
      );

      // CTA
      gsap.fromTo(
        "[data-ht-cta]",
        { opacity: 0, y: 16 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "bottom 95%",
            once: true,
          },
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  /* ---------------- MODAL HANDLERS ---------------- */
  const openModal = async (id: number) => {
    try {
      setModalLoading(true);
      const res = await getTestimonialById(id);
      setSelected(res?.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => setSelected(null);

  return (
    <>
      <section
        ref={sectionRef}
        className="bg-white md:py-16 py-0"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* ---------------- TITLE ---------------- */}
          <h2
            data-ht-title
            className="text-2xl md:text-3xl font-semibold text-gray-900 md:mb-20 mb-14"
          >
            What Our Customers Say
          </h2>

          {/* ---------------- GRID ---------------- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative">
            <img
              src="/quates.png"
              alt="Quotes"
              className="h-16 absolute -top-10 md:-left-5 left-0 z-10"
            />

            {/* ---------- SKELETON ---------- */}
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 pt-10 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded mb-3" />
                  <div className="h-4 bg-gray-200 rounded mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-4/5 mb-6" />
                  <div className="flex justify-end">
                    <div className="h-3 w-24 bg-gray-300 rounded mb-1" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}

            {/* ---------- CARDS ---------- */}
            {!loading &&
              testimonials.map((item, index) => (
                <div
                  key={item.testimonial_id}
                  ref={(el) => {
                    if (el) cardsRef.current[index] = el;
                  }}
                  onClick={() => openModal(item.testimonial_id)}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 pt-10 cursor-pointer hover:shadow-md transition"
                >
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-5">
                    {item.content}
                  </p>

                  <div className="flex justify-end text-end">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.name_of_candidate}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.position_of_candidate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* ---------------- CTA ---------------- */}
          <div data-ht-cta className="flex justify-center">
            <Button
              onClick={() => router.push("/public/testimonials")}
              variant="outline"
              className="rounded-full px-6 py-2 text-sm cursor-pointer"
            >
              View More
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------- MODAL ---------------- */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative bg-white max-w-xl w-full mx-4 rounded-2xl p-6 md:p-8 animate-scaleIn">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <img src="/quates.png" alt="" className="h-14 mb-4" />

            {modalLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6">
                  {selected.content}
                </p>

                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {selected.name_of_candidate}
                  </p>
                  <p className="text-sm text-orange-500">
                    {selected.position_of_candidate}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ---------------- ANIMATION ---------------- */}
      <style jsx>{`
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
