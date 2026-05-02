"use client";

import React, { useEffect, useRef } from "react";
import { X, MapPin, Calendar, MessageSquare } from "lucide-react";
import gsap from "gsap";
import { CONTACT_LINKS } from "@/lib/contact";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  loading: boolean;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project, loading }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (isOpen) {
      if (modalRef.current && modalContentRef.current) {
        gsap.to(modalRef.current, { display: "flex", opacity: 1, duration: 0.3 });
        gsap.fromTo(modalContentRef.current,
          { scale: 0.8, opacity: 0, rotateY: 20, perspective: 1000 },
          { scale: 1, opacity: 1, rotateY: 0, duration: 0.6, ease: "back.out(1.2)" }
        );
      }
    } else {
      if (modalRef.current && modalContentRef.current) {
        gsap.to(modalContentRef.current, { scale: 0.8, opacity: 0, rotateY: -20, duration: 0.4, ease: "power2.in" });
        gsap.to(modalRef.current, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            if (modalRef.current) {
              modalRef.current.style.display = "none";
            }
          }
        });
      }
    }
  }, [isOpen]);

  const getImageUrl = (p: any) => {
    if (p.thumbnail_image) return base_url + p.thumbnail_image;
    if (p.project_image) return base_url + p.project_image;
    if (p.other_images && Array.isArray(p.other_images) && p.other_images.length > 0) return base_url + p.other_images[0];
    return "/placeholder.png";
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[100] hidden items-center justify-center p-4 md:p-8 opacity-0"
      style={{ perspective: "2000px" }}
    >
      <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-xl" onClick={onClose} />

      <div
        className="relative w-full max-w-6xl h-full max-h-[90vh] md:max-h-[85vh] bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row opacity-0"
        ref={modalContentRef}
      >
        {/* FIXED CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 md:top-8 md:right-8 z-[110] w-10 h-10 md:w-12 md:h-12 bg-white/80 md:bg-white/10 backdrop-blur-md text-[#0F172A] md:text-[#0F172A] rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg border border-black/5 md:border-white/20"
        >
          <X size={20} className="md:w-6 md:h-6" />
        </button>

        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : project ? (
          <div className="w-full h-full overflow-y-auto no-scrollbar flex flex-col md:flex-row">
            {/* Modal Right: Details (Top on Mobile: order-1) */}
            <div className="w-full md:w-[40%] p-6 md:p-16 h-auto md:h-full md:overflow-y-auto no-scrollbar flex flex-col order-1 md:order-2">
              <div className="flex items-center gap-3 text-indigo-800 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-4 md:mb-6">
                <Calendar size={14} /> {project.year || "2024"}
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4 md:mb-6 tracking-tighter leading-tight">
                {project.project_title}
              </h2>

              <div className="flex items-center gap-3 text-gray-500 font-bold mb-6 md:mb-10 text-sm md:text-base">
                <MapPin size={16} className="text-indigo-800" /> {project.place}
              </div>

              <div className="space-y-6 md:space-y-8 mb-8 md:mb-12">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 md:mb-3">Project Description</h4>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed font-medium">{project.description}</p>
                </div>

                {project.client && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 md:mb-3">Client</h4>
                    <p className="text-[#0F172A] font-bold text-sm md:text-base">{project.client}</p>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-6 md:pt-10 border-t border-gray-100">
                <button onClick={() => window.open(CONTACT_LINKS.whatsapp, "_blank")} className="w-full bg-[#1e2b58] cursor-pointer text-white py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-indigo-800 transition-all flex items-center justify-center gap-2 md:gap-3">
                  <MessageSquare size={16} className="md:w-[18px] md:h-[18px]" /> Enquire About This Project
                </button>
              </div>
            </div>

            {/* Modal Left: Images (Bottom on Mobile: order-2) */}
            <div className="w-full md:w-[60%] h-auto md:h-full md:overflow-y-auto no-scrollbar bg-gray-50/50 order-2 md:order-1">
              <div className="flex flex-col gap-4 p-4">
                <img src={getImageUrl(project)} className="w-full rounded-[1.5rem] md:rounded-[2rem] shadow-md" alt="" />
                {Array.isArray(project.other_images) && project.other_images.map((img: string, i: number) => (
                  <img key={i} src={base_url + img} className="w-full rounded-[1.5rem] md:rounded-[2rem] shadow-sm" alt="" />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProjectModal;
