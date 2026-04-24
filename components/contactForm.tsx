"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Wrench,
  Clock,
  Headphones,
} from "lucide-react";
import { createEnquiry } from "@/lib/api/enquiry";
import { useToast } from "@/contexts/ToastContext";
import { IconBrandWhatsapp } from "@tabler/icons-react";

export default function ContactForm() {
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      showError("Name is required");
      return;
    }
    if (!form.phone.trim()) {
      showError("Phone number is required");
      return;
    }

    const payload = {
      cstmr_name: form.name,
      cstmr_email: form.email || null,
      cstmr_phone: form.phone,
      cstmr_message: form.message || null,
      enquiry_type: 1,
    };

    try {
      setLoading(true);
      await createEnquiry(payload);
      showSuccess("Application Send Successfully!");

      setForm({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (err: any) {
      showError(`Failed, ${err?.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        {/* ---------------- TOP SECTION ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT INFO CARD */}
          <div className="bg-[#fffaf2] rounded-xl p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Get in Touch
            </h3>

            <ul className="space-y-4 text-sm text-gray-700">
              {/* PHONE */}
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-orange-500 mt-1" />
                <a href="tel:+914832080456" className="hover:underline">
                  +91 483 208 0456
                </a>
              </li>

              {/* EMAIL */}
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-orange-500 mt-1" />
                <a href="mailto:info@ssemlp.com" className="hover:underline">
                  info@ssemlp.com
                </a>
              </li>

              {/* LOCATION */}
              <li className="flex items-start gap-3">
                <MapPin className="md:w-4 md:h-4 text-orange-500 mt-1" />
                <a
                  href="https://maps.app.goo.gl/akzNBpKVM6p5WjPW9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="md:me-32 hover:underline"
                >
                  34B, Inkel Greens, Karathode Oorakam Melmuri PO, Malappuram
                  Kerala - 676 519
                </a>
              </li>
            </ul>

            {/* SOCIAL ICONS */}
            <div className="flex gap-3 mt-6">
              {/* CALL */}
              <a
                href="tel:+914832080456"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                <Phone className="w-4 h-4" />
              </a>

              {/* WHATSAPP */}
              <a
                href="https://wa.me/914832080456"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                <IconBrandWhatsapp className="w-4 h-4" />
              </a>

              {/* EMAIL */}
              <a
                href="mailto:info@ssemlp.com"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* SUPPORT INFO */}
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-center gap-3">
                <Wrench className="w-4 h-4 text-orange-500" />
                Installation & Service Support
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-orange-500" />
                Mon – Sat : 9:00 AM – 6:00 PM
              </li>
              <li className="flex items-center gap-3">
                <Headphones className="w-4 h-4 text-orange-500" />
                24/7 Customer Assistance
              </li>
            </ul>
          </div>

          {/* RIGHT FORM CARD */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Send Us a Message
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Full Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter Your Name"
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Phone Number *
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Your Phone Number"
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Email
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your Email Address"
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Your Message"
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm resize-none focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-black cursor-pointer text-white px-6 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-gray-800 transition disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- MAP ---------------- */}
        <div className="mt-10 rounded-xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps?q=Inkel%20Main%20Road,%20Malappuram&output=embed"
            className="w-full h-[300px] md:h-[380px] border-0"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
