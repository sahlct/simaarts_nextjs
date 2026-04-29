"use client";

import { useEffect, useRef } from "react";
import { ChevronRight, Target, Eye, Calendar, Award, Globe, Users, CheckCircle2, MessageSquare, History, Briefcase } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutClient() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.from(".about-hero-content > *", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
      });

      // Section Fade-ins
      gsap.utils.toArray(".reveal-section").forEach((section: any) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        });
      });

      // Stats Counting
      gsap.from(".stat-number", {
        scrollTrigger: {
          trigger: ".stats-bar",
          start: "top 90%",
        },
        innerText: 0,
        duration: 2,
        snap: { innerText: 1 },
        ease: "power1.out"
      });

      // Team Cards Stagger
      gsap.from(".team-card", {
        scrollTrigger: {
          trigger: ".team-grid",
          start: "top 85%",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
        clearProps: "all"
      });

      // History Items Stagger
      gsap.from(".history-item", {
        scrollTrigger: {
          trigger: ".history-container",
          start: "top 80%",
        },
        x: (i) => (i % 2 === 0 ? -50 : 50),
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power3.out",
        clearProps: "all"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="bg-white overflow-hidden">
      {/* CINEMATIC HERO */}
      <section className="relative h-[600px] md:h-[800px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
            alt="Elbano Showroom"
            className="w-full h-full object-cover scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/20 to-white" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-white about-hero-content pt-20">
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-6 opacity-80">
            <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span>About Us</span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-none">
            About <span className="text-blue-400 block md:inline">elbano</span>
          </h1>

          <p className="text-lg md:text-2xl max-w-2xl text-white/90 leading-relaxed font-medium mb-12">
            Importing the world's finest ceramic tiles since 1995. A legacy of Florence, delivered to your doorstep.
          </p>

          <div className="flex gap-6">
            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
              <ChevronRight size={24} className="rotate-90" />
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-32 reveal-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[2px] bg-indigo-800" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-800">Our Story</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] mb-8 tracking-tighter leading-tight">
                Born from a Passion <br /> for Ceramic & Design
              </h2>
              <div className="space-y-6 text-gray-500 text-base md:text-lg leading-relaxed font-medium">
                <p>
                  Founded in 1995 by master ceramicist Giorgio Elbano, our company began as a small Florence-based importer with a single mission: to bring the world's most beautiful ceramic tiles to architects and homeowners who demand the very best.
                </p>
                <p>
                  Giorgio had spent 20 years working with European tile manufacturers and saw a gap — a curated, expert-led import service for premium ceramic tiles.
                </p>
              </div>
              <div className="mt-12">
                <Link href="/contact" className="inline-flex items-center gap-3 bg-[#1e2b58] text-white px-10 py-5 rounded-[1.25rem] font-black text-xs uppercase tracking-widest hover:bg-[#1e2b58]/80 hover:scale-105 transition-all shadow-xl shadow-gray-200">
                  Work With Us <ChevronRight size={18} />
                </Link>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="aspect-[5/5] rounded-[3rem] overflow-hidden shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=1918&auto=format&fit=crop"
                  alt="Crafting tiles"
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 to-transparent" />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-10 -left-10 md:-left-20 bg-[#1e2b58] p-10 rounded-[2.5rem] shadow-2xl text-white transform hover:scale-110 transition-transform">
                <div className="text-4xl font-black mb-1">30+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 whitespace-nowrap">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-[#F8FAFC] reveal-section">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-indigo-800" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-800">Our Purpose</span>
            <div className="w-12 h-[1px] bg-indigo-800" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] mb-20 tracking-tighter">Vision & Mission</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="bg-white p-10 md:p-12 rounded-[2.5rem] text-left border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 group">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-800 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-800 group-hover:text-white transition-all duration-500 shadow-sm">
                <Eye size={28} className="group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-4">Our Vision</h3>
              <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-base">
                To be the world's most trusted importer of premium ceramic tiles — where every collection reflects the finest craftsmanship from Europe, North Africa, and beyond, delivered with uncompromising quality.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white p-10 md:p-12 rounded-[2.5rem] text-left border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 group">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-800 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-800 group-hover:text-white transition-all duration-500 shadow-sm">
                <Target size={28} className="group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-4">Our Mission</h3>
              <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-base">
                To source and supply imported ceramic tiles of exceptional quality, guide clients with expert design consultation, and deliver every project with precision, care, and lasting value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[#0F172A] py-20 stats-bar">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { label: "Projects Completed", value: "1200", suffix: "+", icon: <Briefcase size={20} /> },
              { label: "Countries Served", value: "60", suffix: "+", icon: <Globe size={20} /> },
              { label: "Tile Designs", value: "5000", suffix: "+", icon: <Box size={20} /> },
              { label: "Client Satisfaction", value: "98", suffix: "%", icon: <Users size={20} /> }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-blue-400 mb-6 border border-white/10">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
                  <span className="stat-number">{stat.value}</span>{stat.suffix}
                </div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR JOURNEY / TIMELINE */}
      <section className="py-32 reveal-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-[1px] bg-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-800">Our Journey</span>
              <div className="w-12 h-[1px] bg-blue-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tighter">30 Years of History</h2>
          </div>

          <div className="relative history-container">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[2px] bg-gray-100 -translate-x-1/2 hidden md:block" />

            <div className="space-y-24">
              {[
                {
                  year: "1995",
                  title: "Founded in Florence",
                  desc: "Elbano was established by master ceramicist Giorgio Elbano in Florence, Italy, with a mission to bring the world's finest ceramic tiles to a global audience.",
                  align: "left"
                },
                {
                  year: "2020",
                  title: "Sustainability Certification",
                  desc: "Achieved ISO 14001 environmental certification, committing to responsible sourcing and eco-conscious logistics across our supply chain.",
                  align: "right"
                },
                {
                  year: "2024",
                  title: "Present Day",
                  desc: "Operating in 60+ countries with over 5,000 tile designs, 1,200 completed projects, and a team of 180 ceramic tile specialists.",
                  align: "left"
                }
              ].map((item, i) => (
                <div key={i} className={`history-item relative flex items-center justify-between md:flex-row ${item.align === "left" ? "md:flex-row-reverse" : ""}`}>
                  <div className="hidden md:block w-5/12" />

                  {/* Timeline Dot */}
                  <div className="absolute left-0 md:left-1/2 w-6 h-6 bg-indigo-800 border-4 border-white rounded-full -translate-x-1/2 z-10 shadow-lg hidden md:block" />

                  <div className="w-full md:w-5/12 bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="text-indigo-800 font-black text-2xl mb-4">{item.year}</div>
                    <h3 className="text-xl font-black text-[#0F172A] mb-4">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE TEAM */}
      <section className="py-32 bg-[#F8FAFC] reveal-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-800">The People</span>
            <div className="w-12 h-[1px] bg-blue-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] mb-4 tracking-tighter">Meet Our Team</h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-24 font-medium italic">The dedicated experts behind every Elbano tile.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 team-grid">
            {[
              { name: "Marco Elbano", role: "Chief Executive Officer", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop" },
              { name: "Sofia Marchetti", role: "Head of Design", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop" },
              { name: "Luca Ferrari", role: "Senior Tile Specialist", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" },
              { name: "Anna Rossi", role: "Global Sourcing Director", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop" }
            ].map((member, i) => (
              <div key={i} className="team-card group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700">
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-black text-[#0F172A] mb-1">{member.name}</h4>
                  <p className="text-xs font-bold text-indigo-800 uppercase tracking-widest">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      {/* <section className="bg-[#0F172A] py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <h2 className="text-4xl md:text-8xl font-black text-white mb-12 tracking-tighter italic leading-none">Let's Build Something <br className="hidden md:block" /> <span className="text-blue-500">Exceptional</span> Together.</h2>
          <Link href="/contact" className="inline-flex items-center gap-4 bg-white text-[#0F172A] px-12 py-6 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white hover:scale-105 transition-all shadow-2xl">
            Get in Touch <MessageSquare size={20} />
          </Link>
        </div>
      </section> */}
    </div>
  );
}

const Box = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);
