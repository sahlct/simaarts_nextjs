"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, ChevronRight, Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { createEnquiry } from "@/lib/api/enquiry";
import { useToast } from "@/contexts/ToastContext";
import { useCompanyProfile } from "@/context/CompanyProfileContext";

gsap.registerPlugin(ScrollTrigger);

export default function ContactClient() {
  const { profile, links } = useCompanyProfile();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".contact-hero-content > *", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
      });

      gsap.from(".info-card", {
        scrollTrigger: {
          trigger: ".info-grid",
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.4)",
        clearProps: "all"
      });

      gsap.from(".form-section", {
        scrollTrigger: {
          trigger: ".form-section",
          start: "top 80%",
        },
        x: -40,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      gsap.from(".form-container", {
        scrollTrigger: {
          trigger: ".form-container",
          start: "top 80%",
        },
        x: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      showError("Please fill in all required fields.");
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      showError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      showError("Invalid phone number. Must be exactly 10 digits.");
      return;
    }

    try {
      setLoading(true);
      await createEnquiry({
        cstmr_name: formData.name,
        cstmr_email: formData.email,
        cstmr_phone: formData.phone,
        cstmr_message: formData.message,
        enquiry_type: 1,
        enquiry_status: 1,
        status: 1
      });
      showSuccess("Thank you! Your inquiry has been submitted to SimaArts.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      console.error("Error submitting enquiry:", error);
      showError(error?.response?.data?.message || "Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={sectionRef} className="bg-[#FAF8F3] min-h-screen">
      {/* HERO HEADER */}
      <section className="relative h-[340px] md:h-[380px] flex items-center overflow-hidden bg-[#2C271D]">
        <div className="absolute inset-0 z-0">
          <img src="/product_bg.png" alt="SimaArts Contact" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C271D] via-[#2C271D]/90 to-[#3D3622]/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-white contact-hero-content pt-20">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[#D5C58A]">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span>Contact Us</span>
          </div>

          <h1 className="text-3xl md:text-6xl font-black mb-4 tracking-tight">
            Contact <span className="text-[#D5C58A]">SimaArts</span>
          </h1>

          <p className="text-xs md:text-base max-w-xl text-gray-200 leading-relaxed font-medium">
            Have questions about custom badge embroidery, bulk troop uniform orders, or official Scout & Guide supplies? We are here to help.
          </p>
        </div>
      </section>

      {/* CONTACT INFO GRID */}
      <section className="py-12 md:py-20 bg-white border-b border-[#EAE4D3] info-grid">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: "Call Us", val: profile.phone_number, sub: profile.working_hours || "Mon-Sat, 9am-6pm", icon: <Phone size={20} />, href: links.tel },
              { label: "Email Us", val: profile.email, sub: "Quick Response", icon: <Mail size={20} />, href: links.mailto },
              { label: "Headquarters", val: profile.location_text || "SimaArts HQ", sub: "India", icon: <MapPin size={20} />, href: profile.location_url || "#" },
              { label: "Working Hours", val: profile.working_hours || "Mon - Sat", sub: "9:00 AM - 6:00 PM", icon: <Clock size={20} />, href: "#" }
            ].map((item, i) => (
              <a key={i} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined} className="info-card group cursor-pointer bg-[#FAF8F3] p-5 md:p-8 rounded-2xl border border-[#EAE4D3] shadow-xs hover:border-[#D5C58A] hover:bg-white transition-all duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white text-[#8C7E4F] border border-[#EAE4D3] rounded-xl flex items-center justify-center mb-4 shadow-xs group-hover:bg-[#D5C58A] group-hover:text-[#2C271D] transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-[9px] md:text-xs font-black uppercase tracking-wider text-[#857A68] mb-1">{item.label}</h3>
                <div className="text-sm md:text-lg font-black text-[#2C271D] mb-1 truncate">{item.val}</div>
                <p className="text-[10px] md:text-xs text-[#5A5243] font-semibold truncate">{item.sub}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FORM & DETAILS */}
      <section className="py-12 md:py-24 bg-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column: Details */}
            <div className="form-section">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-[2px] bg-[#D5C58A]" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#8C7E4F]">Bulk & Custom Orders</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-[#2C271D] mb-6 tracking-tight leading-tight">
                Request a Custom Quote for Your Troop
              </h2>
              <p className="text-[#5A5243] text-sm md:text-base leading-relaxed font-medium mb-10">
                Send us your badge artwork, uniform specifications, or troop requirements. Our specialists will assist you with pricing, embroidery samples, and delivery timelines.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-[#EAE4D3] flex items-center justify-center text-[#8C7E4F] shrink-0 shadow-xs">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h4 className="text-[#2C271D] font-extrabold text-base mb-1">Custom Badge Embroidery</h4>
                    <p className="text-[#5A5243] text-xs md:text-sm font-medium">Send high-resolution badge artwork for precision thread matching and sample proofing.</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex gap-3">
                <Link href={profile.facebook_url || "https://facebook.com"} target="_blank" className="w-11 h-11 rounded-xl border border-[#EAE4D3] bg-white flex items-center justify-center text-[#2C271D] hover:bg-[#D5C58A] transition-all"><Facebook size={18} /></Link>
                <Link href={profile.insta_url || "https://instagram.com"} target="_blank" className="w-11 h-11 rounded-xl border border-[#EAE4D3] bg-white flex items-center justify-center text-[#2C271D] hover:bg-[#D5C58A] transition-all"><Instagram size={18} /></Link>
                <Link href={links.mailto} className="w-11 h-11 rounded-xl border border-[#EAE4D3] bg-white flex items-center justify-center text-[#2C271D] hover:bg-[#D5C58A] transition-all"><Mail size={18} /></Link>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="form-container">
              <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EAE4D3]">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-[#857A68] ml-2">Your Name *</label>
                      <input
                        type="text"
                        placeholder="Leader / Officer Name"
                        required
                        className="w-full bg-[#FAF8F3] border border-[#EAE4D3] rounded-xl p-3 text-xs font-bold text-[#2C271D] focus:ring-2 focus:ring-[#D5C58A] transition-all outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-[#857A68] ml-2">Email Address *</label>
                      <input
                        type="email"
                        placeholder="leader@troop.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#FAF8F3] border border-[#EAE4D3] rounded-xl px-4 py-3 text-xs font-bold text-[#2C271D] outline-none focus:ring-2 focus:ring-[#D5C58A]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-[#857A68] ml-2">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="+91 9995616166"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#FAF8F3] border border-[#EAE4D3] rounded-xl px-4 py-3 text-xs font-bold text-[#2C271D] outline-none focus:ring-2 focus:ring-[#D5C58A]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-[#857A68] ml-2">Message & Details *</label>
                    <textarea
                      rows={4}
                      placeholder="Specify badge quantities, uniform sizes, or custom requirements..."
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#FAF8F3] border border-[#EAE4D3] rounded-xl px-4 py-3 text-xs font-bold text-[#2C271D] outline-none focus:ring-2 focus:ring-[#D5C58A] resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#4A4229] hover:bg-[#3D3622] text-[#FAF8F3] py-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      "Sending..."
                    ) : (
                      <><Send size={16} /> Submit Inquiry</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="h-[360px] md:h-[450px] w-full bg-gray-100 border-t border-[#EAE4D3]">
        <iframe
          src={profile.location_url && profile.location_url.includes("embed") ? profile.location_url : "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3914.980903717614!2d75.9529!3d11.1148!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba64f48d1ab3b05%3A0x820087cecaef4575!2sELBANO%20ROOFINGS!5e0!3m2!1sen!2sin!4v1777737554636!5m2!1sen!2sin"}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
  );
}

