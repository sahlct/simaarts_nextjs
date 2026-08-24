"use client";

import { useEffect, useRef } from "react";
import { ChevronRight, Target, Eye, Globe, Users, Briefcase, Award, ShieldCheck, Sparkles, Ribbon, ArrowRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutClient() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".about-hero-content > *", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
      });

      gsap.utils.toArray(".reveal-section").forEach((section: any) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        });
      });

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="bg-[#FAF8F3] overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[480px] md:h-[520px] flex items-center overflow-hidden bg-[#2C271D]">
        <div className="absolute inset-0 z-0">
          <img
            src="/about_hero_02.png"
            alt="SimaArts Workshop"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/about_hero.jpeg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C271D] via-[#2C271D]/90 to-[#3D3622]/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-white about-hero-content pt-20">
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-4 text-[#D5C58A]">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span>About Us</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight leading-none text-white">
            About <span className="text-[#D5C58A]">SimaArts</span>
          </h1>

          <p className="text-base md:text-xl max-w-2xl text-gray-200 leading-relaxed font-medium mb-8">
            Crafting official, certified Scout & Guide badges, embroidered insignia, school uniforms, scarves, and accessories built with pride and durability.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-16 md:py-28 reveal-section bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* LEFT COLUMN: IMAGE & CRAFTSMANSHIP BADGE */}
            <div className="lg:col-span-5 relative">
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden border-2 border-[#D5C58A]/40 shadow-2xl group">
                <img
                  src="/about_story.png"
                  alt="SimaArts Badge Craftsmanship"
                  className="w-full h-[420px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/product_bg.png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C271D]/70 via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#EAE4D3] shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#4A4229] text-[#FAF8F3] flex items-center justify-center shrink-0">
                      <Award size={20} />
                    </div>
                    <div>
                      <span className="block text-xs font-black text-[#2C271D] uppercase tracking-wider">
                        25+ Years Excellence
                      </span>
                      <span className="text-[11px] text-[#5A5243] font-semibold">
                        High-Stitch Precision Embroidery
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Accent Background Box */}
              <div className="absolute -bottom-6 -left-6 w-full h-full bg-[#FAF8F3] border border-[#EAE4D3] rounded-[3rem] -z-0 hidden md:block" />
            </div>

            {/* RIGHT COLUMN: STORY & FEATURE LIST */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-[2px] bg-[#D5C58A]" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#8C7E4F]">
                  Our Story & Heritage
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-[#2C271D] leading-tight mb-6 tracking-tight">
                Crafting Scout & Guide Legacy With <span className="text-[#8C7E4F]">Precision & Pride</span>
              </h2>

              <p className="text-[#5A5243] text-sm md:text-base leading-relaxed font-medium mb-8">
                SimaArts is a pioneer in manufacturing and supplying official high-precision embroidered badges, certified uniforms, scarves, woggles, caps, belts, and insignia for Scouts, Guides, Schools, and Youth Organizations across India.
              </p>

              {/* FEATURE HIGHLIGHT CARDS */}
              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAF8F3] border border-[#EAE4D3] hover:border-[#D5C58A] transition-all group">
                  <div className="w-11 h-11 rounded-xl bg-white border border-[#EAE4D3] text-[#8C7E4F] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#D5C58A] group-hover:text-[#2C271D] transition-all">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-black text-[#2C271D] mb-1">
                      Embroidered Badges & Insignia
                    </h3>
                    <p className="text-xs md:text-sm text-[#5A5243] font-medium leading-normal">
                      Crafted using computerised high-density stitch machinery with colour-fast thread, ensuring flawless detail and long-lasting strength.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAF8F3] border border-[#EAE4D3] hover:border-[#D5C58A] transition-all group">
                  <div className="w-11 h-11 rounded-xl bg-white border border-[#EAE4D3] text-[#8C7E4F] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#D5C58A] group-hover:text-[#2C271D] transition-all">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-black text-[#2C271D] mb-1">
                      Certified Scout & Guide Uniforms
                    </h3>
                    <p className="text-xs md:text-sm text-[#5A5243] font-medium leading-normal">
                      Standard-compliant fabrics engineered for durability and maximum comfort during camps, parades, and field drills.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAF8F3] border border-[#EAE4D3] hover:border-[#D5C58A] transition-all group">
                  <div className="w-11 h-11 rounded-xl bg-white border border-[#EAE4D3] text-[#8C7E4F] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#D5C58A] group-hover:text-[#2C271D] transition-all">
                    <Ribbon size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-black text-[#2C271D] mb-1">
                      Official Accessories & Troop Awards
                    </h3>
                    <p className="text-xs md:text-sm text-[#5A5243] font-medium leading-normal">
                      Scarves, leather woggles, brass belt buckles, flags, banners, and rank stars manufactured strictly to official regulations.
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-[#4A4229] hover:bg-[#3D3622] text-[#FAF8F3] px-7 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  Explore Products <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#D5C58A] hover:bg-[#c4b377] text-[#2C271D] px-7 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
                >
                  Work With Us <ChevronRight size={16} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[#3D3622] py-12 md:py-20 stats-bar text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { label: "Items & Designs", value: "1000", suffix: "+", icon: <Award size={20} className="text-[#D5C58A]" /> },
              { label: "States & Regions", value: "28", suffix: "+", icon: <Globe size={20} className="text-[#D5C58A]" /> },
              { label: "Years Experience", value: "25", suffix: "+", icon: <Briefcase size={20} className="text-[#D5C58A]" /> },
              { label: "Troop Satisfaction", value: "100", suffix: "%", icon: <Users size={20} className="text-[#D5C58A]" /> }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-5xl font-black text-[#D5C58A] mb-1 tracking-tight">
                  <span className="stat-number">{stat.value}</span>{stat.suffix}
                </div>
                <div className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="py-16 md:py-28 bg-[#FAF8F3] reveal-section">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-[#D5C58A]" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#8C7E4F]">Our Purpose</span>
            <div className="w-10 h-[2px] bg-[#D5C58A]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#2C271D] mb-12 tracking-tight">Vision & Mission</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] text-left border border-[#EAE4D3] shadow-xs group">
              <div className="w-14 h-14 bg-[#FAF8F3] text-[#8C7E4F] border border-[#EAE4D3] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#D5C58A] group-hover:text-[#2C271D] transition-all duration-300">
                <Eye size={26} />
              </div>
              <h3 className="text-xl font-black text-[#2C271D] mb-3">Our Vision</h3>
              <p className="text-[#5A5243] leading-relaxed font-medium text-sm md:text-base">
                To be India's premier and most trusted brand for official Scout & Guide equipment — empowering youth troops with authentic, high-quality badges and uniforms that inspire discipline and pride.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] text-left border border-[#EAE4D3] shadow-xs group">
              <div className="w-14 h-14 bg-[#FAF8F3] text-[#8C7E4F] border border-[#EAE4D3] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#D5C58A] group-hover:text-[#2C271D] transition-all duration-300">
                <Target size={26} />
              </div>
              <h3 className="text-xl font-black text-[#2C271D] mb-3">Our Mission</h3>
              <p className="text-[#5A5243] leading-relaxed font-medium text-sm md:text-base">
                To manufacture standard-compliant Scout & Guide products with immaculate embroidery and durable fabric, maintaining prompt delivery and accessible pricing for all educational and troop organizations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

