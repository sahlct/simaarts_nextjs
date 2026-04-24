"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getServices } from "@/lib/api/service";
import gsap from "gsap";

interface Service {
  service_id: number;
  service_title: string;
  service_description: string;
  service_image: string;
}

export default function OurServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await getServices(1, 4, "", 1);
        setServices(res?.data || []);
      } catch (error) {
        console.error("Service fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  /* ---------------- GSAP ANIMATION ---------------- */
  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-os-title]", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 28,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  /* ---------------- MODAL ANIMATIONS ---------------- */
  useEffect(() => {
    if (openModal) {
      // Ensure display is set before animating
      gsap.set(modalOverlayRef.current, { display: "flex" });

      gsap.to(modalOverlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.fromTo(
        modalContentRef.current,
        { scale: 0.9, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.4)" }
      );

      // Prevent scrolling
      document.body.style.overflow = "hidden";
    }
  }, [openModal]);

  const handleCloseModal = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setOpenModal(false);
        setSelectedService(null);
        document.body.style.overflow = "unset";
        // Reset display to none so it doesn't block clicks
        gsap.set(modalOverlayRef.current, { display: "none" });
      }
    });

    tl.to(modalContentRef.current, {
      scale: 0.9,
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.in"
    })
      .to(modalOverlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      }, "-=0.2");
  };

  const handleOpenModal = (service: Service) => {
    setSelectedService(service);
    setOpenModal(true);
  };

  return (
    <section
      ref={sectionRef}
      className="bg-[#fffaf2] py-10 md:py-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ---------------- HEADER ---------------- */}
        <div data-os-title className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            Our Services
          </h2>
          <p className="text-gray-500 text-sm md:text-base md:px-60 text-start md:text-center">
            At SS Enterprises, we value quality and competence. Every design we provide has precisely
            engineered PVC and uPVC door solutions that offer long-term performance.
          </p>
        </div>

        {/* ---------------- GRID ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* ----------- SKELETON ----------- */}
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-md" />
                  <div className="h-4 w-28 bg-gray-200 rounded" />
                </div>

                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                  <div className="h-3 bg-gray-200 rounded w-4/6" />
                </div>
              </div>
            ))}

          {/* ----------- REAL DATA ----------- */}
          {!loading &&
            services.map((service, index) => {
              const icon = service.service_image
                ? base_url + service.service_image
                : "/placeholder.png";

              return (
                <div
                  key={service.service_id}
                  ref={(el) => {
                    if (el) cardsRef.current[index] = el;
                  }}
                  className="flex flex-col items-start text-start cursor-pointer group"
                  onClick={() => handleOpenModal(service)}
                >
                  {/* ICON + TITLE */}
                  <div className="flex items-end gap-3 mb-4" >
                    <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={icon}
                        alt={service.service_title}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {service.service_title}
                    </h4>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-gray-600 leading-relaxed max-w-xs cursor-pointer group-hover:text-gray-950 transition line-clamp-4">
                    {service.service_description}
                  </p>
                </div>
              );
            })}
        </div>
      </div>


      {/* ---------------- MODAL ---------------- */}
      <div
        ref={modalOverlayRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm items-center justify-center z-[100] hidden opacity-0"
        onClick={handleCloseModal}
      >
        <div
          ref={modalContentRef}
          className="bg-white rounded-lg p-6 max-w-2xl w-[92%] sm:w-[85%] md:w-full shadow-lg relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl cursor-pointer"
            onClick={handleCloseModal}
          >
            ✕
          </button>

          {selectedService && (
            <>
              <Image
                src={
                  selectedService.service_image
                    ? base_url + selectedService.service_image
                    : "/placeholder.png"
                }
                alt={selectedService.service_title}
                width={80}
                height={80}
                className="object-contain mb-4"
              />

              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                {selectedService.service_title}
              </h3>

              <p className="text-gray-700 leading-relaxed max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {selectedService.service_description}
              </p>

            </>
          )}
        </div>
      </div>
    </section>
  );
}


