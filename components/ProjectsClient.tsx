"use client";

import { useEffect, useRef, useState } from "react";
import { getProjects, getProjectById } from "@/lib/api/projects";
import { MapPin, X, ChevronLeft, ChevronRight, Calendar, Info, Clock, CheckCircle2, MessageSquare, Layout, Box } from "lucide-react";
import Link from "next/link";
import { CONTACT_INFO, CONTACT_LINKS } from "@/lib/contact";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import ProjectModal from "./ProjectModal";

gsap.registerPlugin(ScrollTrigger);

const safeParse = (data: any) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }
  return [];
};

export default function ProjectsClient() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal State
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchProjects = async (page: number) => {
    try {
      setLoading(true);
      const res = await getProjects(page, 18, "", 1);
      const data = res?.data || [];

      // Normalize images
      data.forEach((p: any) => {
        p.other_images = safeParse(p.other_images);
      });

      setProjects(data);
      setTotalPages(res?.totalPages || 1);
      setTotal(res?.total || 0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage]);

  const handleProjectClick = async (projectId: number) => {
    try {
      setModalLoading(true);
      setIsModalOpen(true);
      const res = await getProjectById(projectId);
      const data = res?.data;

      if (data) {
        data.other_images = safeParse(data.other_images);
      }

      setSelectedProject(data);
    } catch (error) {
      console.error("Error fetching project details:", error);
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const getImageUrl = (project: any) => {
    if (project.thumbnail_image) return base_url + project.thumbnail_image;
    if (project.project_image) return base_url + project.project_image;
    if (project.other_images && Array.isArray(project.other_images) && project.other_images.length > 0) return base_url + project.other_images[0];
    return "/placeholder.png";
  };

  const getHeightClass = (index: number) => {
    const mod = index % 6;
    if (mod === 0) return "h-[350px] md:h-[400px]";
    if (mod === 1) return "h-[200px] md:h-[250px]";
    if (mod === 2) return "h-[300px] md:h-[350px]";
    if (mod === 3) return "h-[250px] md:h-[300px]";
    if (mod === 4) return "h-[400px] md:h-[450px]";
    return "h-[230px] md:h-[280px]";
  };

  return (
    <div className="bg-white min-h-screen">
      {/* HERO HEADER */}
      <section className="relative h-[400px] md:h-[350px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/product_bg.jpg" alt="Header Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-white pt-20">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 opacity-80">
            <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span>Projects</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
            Our <span className="text-blue-400">Projects</span>
          </h1>

          <p className="text-xs md:text-sm max-w-xl text-white/80 leading-relaxed font-medium">
            Transforming homes and landmarks across 60+ countries with handcrafted clay tiles that blend tradition with modern architectural excellence.
          </p>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[#0F172A] py-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter">1,200+</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter">60+</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter">30+</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter">98%</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="py-16 md:py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-800">Portfolio</span>
            <div className="w-12 h-[1px] bg-blue-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight">Featured Work</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-[2.5rem] h-[400px] animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {projects.map((project, index) => (
                <div
                  key={project.project_id}
                  onClick={() => handleProjectClick(project.project_id)}
                  className={`relative group break-inside-avoid overflow-hidden rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer ${getHeightClass(index)}`}
                >
                  <img src={getImageUrl(project)} alt={project.project_title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest mb-1 block">{project.year || "2024"}</span>
                    <h3 className="text-white text-lg md:text-xl font-black leading-tight mb-1">{project.project_title}</h3>
                    <div className="flex items-center text-white/80 text-[10px] font-bold">
                      <MapPin size={12} className="mr-2 text-blue-400" /> {project.place}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-24 flex justify-center items-center gap-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center hover:bg-[#0F172A] hover:text-white disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-12 h-12 rounded-full font-bold text-sm transition-all ${currentPage === i + 1 ? "bg-[#0F172A] text-white shadow-xl scale-110" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center hover:bg-[#0F172A] hover:text-white disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* PROCESS SECTION */}
      <section className="py-16 md:py-32 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-indigo-800" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-800">How We Work</span>
            <div className="w-12 h-[1px] bg-indigo-800" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] mb-8 tracking-tight">Our Process</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-20 font-medium">From initial consultation to final installation, we ensure every project is delivered to the highest standards.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: "01", title: "Consultation", desc: "We discuss your project requirements, budget, and architectural vision.", icon: <MessageSquare size={24} /> },
              { id: "02", title: "Design & Selection", desc: "Our experts help you choose the perfect tile style, colour and profile.", icon: <Layout size={24} /> },
              { id: "03", title: "Production", desc: "Tiles are kiln-fired to your specification in our premium production facility.", icon: <Box size={24} /> },
              { id: "04", title: "Installation", desc: "Our certified installers ensure flawless fitting and weatherproofing.", icon: <CheckCircle2 size={24} /> }
            ].map((step, i) => (
              <div key={i} className="group bg-white p-10 rounded-[2.5rem] text-left border border-gray-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-8 right-8 text-6xl font-black text-blue-100 group-hover:text-blue-200 transition-colors">{step.id}</div>
                <div className="w-14 h-14 bg-[#0F172A] text-white rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-xl font-black text-[#0F172A] mb-4 relative z-10">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      {/* <section className="bg-[#0F172A] py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter italic">Start Your Project Today</h2>
          <p className="text-white/60 mb-10 text-sm md:text-base font-medium">Join over 1,200 satisfied clients who trusted Elbano with their roofing.</p>
          <Link href="/contact" className="inline-flex items-center gap-3 bg-cyan-700 text-white px-8 py-4 rounded-[1.1rem] font-black text-xs uppercase tracking-widest hover:bg-cyan-800 hover:scale-105 transition-all shadow-2xl shadow-cyan-600/20">
            Get Free Consultation <ChevronRight size={16} />
          </Link>
        </div>
      </section> */}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        project={selectedProject}
        loading={modalLoading}
      />
    </div>
  );
}

