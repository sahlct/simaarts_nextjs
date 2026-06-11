"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, ChevronRight, Plus, Minus, Facebook, Instagram, Linkedin, Twitter, Globe } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { createEnquiry } from "@/lib/api/enquiry";
import { useToast } from "@/contexts/ToastContext";
import { CONTACT_INFO, CONTACT_LINKS } from "@/lib/contact";

gsap.registerPlugin(ScrollTrigger);

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const { showSuccess, showError } = useToast();

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".contact-hero-content > *", {
        y: 60,
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
        y: 40,
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
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      gsap.from(".form-container", {
        scrollTrigger: {
          trigger: ".form-container",
          start: "top 80%",
        },
        x: 50,
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
      // toast.error("Please fill in all required fields.");
      showError("Please fill in all required fields.");
      return;
    }

    // Backend Strict Validation Matching
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
      showError("Invalid email. Only @gmail.com addresses are allowed.");
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
        enquiry_type: 1, // General Enquiry
        enquiry_status: 1, // New
        status: 1 // Active
      });
      showSuccess("Thank you! Your message has been sent successfully.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      console.error("Error submitting enquiry:", error);
      showError(error?.response?.data?.message || "Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: "What is your typical lead time for custom tile orders?",
      a: "For custom kiln-fired tiles from our Florence facility, the typical lead time is 6-8 weeks, depending on the complexity and quantity of the order."
    },
    {
      q: "Do you offer international shipping?",
      a: "Yes, we operate in 60+ countries and offer global logistics support to ensure your tiles arrive safely at any location worldwide."
    },
    {
      q: "Can I request a sample before placing a large order?",
      a: "Absolutely. We encourage architects and homeowners to request physical samples to experience the texture and color in their specific lighting."
    },
    {
      q: "Do you provide installation services?",
      a: "While we specialize in supply, we have a network of certified master installers in several regions who are experts in handling Elbano tiles."
    }
  ];

  return (
    <div ref={sectionRef} className="bg-white min-h-screen">
      {/* HERO HEADER */}
      <section className="relative h-[400px] md:h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/product_bg.png" alt="Contact Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#282d63]/70 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-white contact-hero-content pt-24 md:pt-32">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 opacity-80">
            <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span>Contact Us</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
            Get in <span className="text-blue-400">Touch</span>
          </h1>

          <p className="text-xs md:text-base max-w-xl text-white/70 leading-relaxed font-medium">
            Have a question about our collections or a custom project? Our team of tile specialists is here to guide you.
          </p>
        </div>
      </section>

      {/* CONTACT INFO GRID */}
      <section className="py-12 md:py-24 bg-[#F8FAFC] info-grid">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {/* Info Cards */}
            {[
              { label: "Call Us", val: CONTACT_INFO.phone, sub: "Mon-Sat, 9am-6pm", icon: <Phone size={20} className="md:w-6 md:h-6" />, href: CONTACT_LINKS.tel },
              { label: "Email Us", val: CONTACT_INFO.email, sub: "Fast Response", icon: <Mail size={20} className="md:w-6 md:h-6" />, href: CONTACT_LINKS.mailto },
              { label: "Headquarters", val: "Karuvankallu", sub: "Malappuram, Kerala", icon: <MapPin size={20} className="md:w-6 md:h-6" />, href: CONTACT_INFO.googleMapsUrl },
              { label: "Office Hours", val: "Open Daily", sub: "9 AM - 6 PM", icon: <Clock size={20} className="md:w-6 md:h-6" />, href: "#" }
            ].map((item, i) => (
              <a key={i} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined} className="info-card group cursor-pointer bg-white p-5 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-200/50 hover:-translate-y-2 transition-all duration-500">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-50 text-[#1e2b58] rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-8 shadow-sm group-hover:bg-[#282d63] group-hover:text-white transition-all duration-300">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-[8px] md:text-xs font-black uppercase tracking-widest text-gray-400 mb-1 md:mb-2">{item.label}</h3>
                <div className="text-sm md:text-xl font-black text-[#1e2b58] mb-1 md:mb-2 truncate">{item.val}</div>
                <p className="text-[10px] md:text-sm text-gray-500 font-medium truncate">{item.sub}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FORM & DETAILS */}
      <section className="py-12 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Left Column: Details */}
            <div className="form-section">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[2px] bg-indigo-800" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-800">Inquiry Form</span>
              </div>
              <h2 className="text-2xl md:text-5xl font-black text-[#0F172A] mb-10 tracking-tighter leading-tight">
                Tell Us About <br /> Your Project
              </h2>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed font-medium mb-12">
                Whether you're an architect planning a landmark building or a homeowner renovating your sanctuary, we provide personalized consultation for every scale.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-indigo-800 group-hover:bg-indigo-800 group-hover:text-white transition-colors flex-shrink-0">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="text-[#0F172A] font-black text-lg mb-1">Live Consultation</h4>
                    <p className="text-gray-500 text-sm font-medium">Chat with our designers to explore material possibilities.</p>
                  </div>
                </div>
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-indigo-800 group-hover:bg-indigo-800 group-hover:text-white transition-colors flex-shrink-0">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="text-[#0F172A] font-black text-lg mb-1">Global Showrooms</h4>
                    <p className="text-gray-500 text-sm font-medium">Locate your nearest Elbano gallery to experience tiles in person.</p>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex gap-4">
                <Link href={CONTACT_INFO.facebook} target="_blank" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[#0F172A] hover:bg-[#282d63] hover:text-white transition-all"><Facebook size={18} /></Link>
                <Link href={CONTACT_INFO.instagram} target="_blank" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[#0F172A] hover:bg-[#282d63] hover:text-white transition-all"><Instagram size={18} /></Link>
                <Link href={CONTACT_LINKS.mailto} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[#0F172A] hover:bg-[#282d63] hover:text-white transition-all"><Mail size={18} /></Link>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="form-container">
              <form onSubmit={handleSubmit} className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl shadow-gray-200 border border-white">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Your Name *</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        required
                        className="w-full bg-[#F8FAFC] border-none rounded-2xl p-3.5 md:p-5 text-sm font-bold text-[#0F172A] focus:ring-2 focus:ring-indigo-800 transition-all outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address *</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        required
                        className="w-full bg-[#F8FAFC] border-none rounded-2xl p-3.5 md:p-5 text-sm font-bold text-[#0F172A] focus:ring-2 focus:ring-indigo-800 transition-all outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 00000 00000"
                      className="w-full bg-[#F8FAFC] border-none rounded-2xl p-3.5 md:p-5 text-sm font-bold text-[#0F172A] focus:ring-2 focus:ring-indigo-800 transition-all outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Your Message *</label>
                    <textarea
                      placeholder="Tell us about your project requirements..."
                      rows={5}
                      required
                      className="w-full bg-[#F8FAFC] border-none rounded-2xl p-3.5 md:p-5 text-sm font-bold text-[#0F172A] focus:ring-2 focus:ring-indigo-800 transition-all outline-none resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1e2b58] cursor-pointer hover:bg-indigo-950 text-white py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 md:gap-3 shadow-xl hover:shadow-blue-200 active:scale-95"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Send size={16} className="md:w-[18px] md:h-[18px]" /> Send Message</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      {/* <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-[#0F172A] tracking-tighter mb-4">FAQ</h2>
            <p className="text-gray-500 font-medium">Quick answers to common questions about our products and services.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-[2rem] overflow-hidden transition-all duration-300 hover:border-blue-100">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-8 text-left bg-white transition-colors hover:bg-gray-50"
                >
                  <span className="text-lg font-black text-[#0F172A] leading-tight pr-6">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 transition-transform duration-300 ${activeFaq === i ? "rotate-45 bg-[#282d63] text-white" : ""}`}>
                    <Plus size={18} />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFaq === i ? "max-h-[500px] border-t border-gray-50" : "max-h-0"}`}>
                  <div className="p-8 text-gray-500 font-medium leading-relaxed bg-gray-50/30">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* MAP SECTION */}
      <section className="h-[400px] md:h-[600px] w-full bg-gray-100">
        <iframe
          src={CONTACT_INFO.mapEmbedUrl}
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
