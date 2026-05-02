"use client";

import { useEffect, useRef, useState } from "react";
import { getProjects, getProjectById } from "@/lib/api/projects";
import { MapPin } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import ProjectModal from "./ProjectModal";

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

export default function HomeProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects(1, 6, "", 1);
        setProjects(res?.data || []);
        if (res?.total) setTotal(res.total);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

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

  useEffect(() => {
    if (loading || projects.length === 0 || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo("[data-hp-title]", 
        { opacity: 0, y: 20 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "all"
        }
      );

      gsap.fromTo(".project-card", 
        { opacity: 0, y: 50 },
        {
          scrollTrigger: {
            trigger: ".project-card-container",
            start: "top 75%",
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.2)",
          clearProps: "all"
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, projects]);

  // Determine height based on index to create a masonry look
  const getHeightClass = (index: number) => {
    const mod = index % 5;
    if (mod === 0) return "h-[450px] md:h-[550px]"; // Tall
    if (mod === 1) return "h-[300px] md:h-[350px]"; // Short
    if (mod === 2) return "h-[350px] md:h-[400px]"; // Medium
    if (mod === 3) return "h-[400px] md:h-[450px]"; // Med-Tall
    return "h-[320px] md:h-[380px]";
  };

  const getImageUrl = (project: any) => {
    if (project.thumbnail_image) return base_url + project.thumbnail_image;
    if (project.project_image) return base_url + project.project_image;
    if (project.images && project.images.length > 0) return base_url + project.images[0];
    return "/placeholder.png";
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center bg-[#FAFAFA]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) return null;

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-[#F8FAFC] to-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div data-hp-title className="text-center mb-16 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-[1px] bg-[#1E2B4D]" />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#1E2B4D] uppercase">
              Featured Projects
            </span>
            <div className="w-10 h-[1px] bg-[#1E2B4D]" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-[#0F172A] tracking-tight mb-6">
            Roofs We've Transformed
          </h2>
          
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl">
            From Mediterranean villas to modern desert homes — our clay tiles have graced remarkable buildings across 48 countries.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="project-card-container columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {projects.map((project, index) => {
            const title = project.project_title || "Project Title";
            const location = project.place || "Global Location";
            const year = project.year || "2024";
            
            return (
              <div 
                key={project.project_id || index}
                onClick={() => handleProjectClick(project.project_id)}
                className={`project-card relative group break-inside-avoid overflow-hidden rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-[#0F172A]/20 transition-all duration-500 cursor-pointer ${getHeightClass(index)}`}
              >
                {/* Background Image */}
                <img 
                  src={getImageUrl(project)}
                  alt={title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                />

                {/* Badge Top Left */}
                <div className="absolute top-6 left-6 z-20">
                  <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wider shadow-sm border border-white/10">
                    Residential
                  </span>
                </div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content Container (Bottom Aligned) */}
                <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end">
                  
                  {/* Static Content */}
                  <div className="transform group-hover:-translate-y-2 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                    <span className="text-white/70 text-xs font-bold tracking-widest mb-2 block">
                      {year}
                    </span>
                    <h3 className="text-white text-2xl md:text-3xl font-bold mb-2 leading-tight">
                      {title}
                    </h3>
                    <div className="flex items-center text-white/70 text-sm font-medium">
                      <MapPin className="w-4 h-4 mr-1.5 opacity-80" />
                      {location}
                    </div>
                  </div>

                  {/* Hover Expanding Content */}
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] opacity-0 group-hover:opacity-100">
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-3 text-white/90 text-xs font-semibold pt-5 mt-5 border-t border-white/20">
                        <span className="truncate">Premium Quality Tile</span>
                        <span className="w-1 h-1 rounded-full bg-orange-400 shrink-0" />
                        <span className="shrink-0">Custom Project</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        {total > 6 && (
          <div className="mt-16 flex justify-center">
            <Link
              href="/projects"
              className="bg-[#1E2B4D] text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-[#0F172A] hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-[#1E2B4D]/20"
            >
              View All Projects
            </Link>
          </div>
        )}

      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        project={selectedProject}
        loading={modalLoading}
      />
    </section>
  );
}
