"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle, Send } from "lucide-react";
import { createEnquiry } from "@/lib/api/enquiry";
import { useToast } from "@/contexts/ToastContext";

export default function ServiceConnect() {
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
      enquiry_type: 3, //  STATIC AS REQUESTED
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
    <section className="bg-[#f4f6fb]">
      {/* ---------------- TOP QUICK SUPPORT BAR ---------------- */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h4 className="font-semibold text-gray-900 text-2xl">
              Quick Support
            </h4>
            <p className="text-sm text-gray-500">Reach us instantly</p>
          </div>

          <div className="flex flex-wrap  md:gap-8 gap-5 text-md">
            {/* PHONE */}
            <a
              href="tel:+914832080456"
              className="flex items-center gap-2 hover:text-orange-600 transition cursor-pointer"
            >
              <Phone className="w-4 h-4 text-orange-500" />
              <span>+91 483 208 0456</span>
            </a>

            {/* EMAIL */}
            <a
              href="mailto:info@ssemlp.com"
              className="flex items-center gap-2 hover:text-blue-600 transition cursor-pointer"
            >
              <Mail className="w-4 h-4 text-blue-500" />
              <span>info@ssemlp.com</span>
            </a>

            {/* WHATSAPP */}
            <a
              href="https://wa.me/914832080456"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-green-600 transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-green-500" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>
      </div>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT INFO */}
          <div className="flex flex-col justify-end">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Connect and Know More About Us
            </h2>

            <p className="text-gray-600 text-md max-w-md mb-6">
              Our costume support team can connect with you and arrange a meet up for you to visit us and
              personally choose your favorite SS products.
            </p>

            <ul className="space-y-3 text-md text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">✓</span>
                Premium PVC and uPVC doors
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">✓</span>
                Rust-free Door Solutions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">✓</span>
                100% Pest Resistant
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">✓</span>
                Budget friendly designs
              </li>
            </ul>
          </div>

          {/* RIGHT FORM */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="space-y-5">
              {/* NAME */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter Your Name"
                  className="w-full rounded-md bg-gray-50 border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Your Phone Number"
                  className="w-full rounded-md bg-gray-50 border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your Email Address"
                  className="w-full rounded-md bg-gray-50 border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* MESSAGE */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe your issue"
                  rows={4}
                  className="w-full rounded-md bg-gray-50 border border-gray-200 px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* SUBMIT */}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-black cursor-pointer text-white px-6 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-gray-800 transition disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
