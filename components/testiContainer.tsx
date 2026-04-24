"use client";

import {
  getTestimonials,
  getTestimonialById,
} from "@/lib/api/testimonial";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface Testimonial {
  testimonial_id: number;
  name_of_candidate: string;
  position_of_candidate: string;
  image_of_candidate: string;
  content: string;
}

export default function TestimonialContainer() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);

  const LIMIT = 9;

  const loadTestimonials = async (pageNo: number) => {
    try {
      setLoading(true);
      const res = await getTestimonials(pageNo, LIMIT, "", { status: "1" });
      setTestimonials(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch testimonials", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials(page);
  }, [page]);

  const openModal = async (id: number) => {
    try {
      setModalLoading(true);
      const res = await getTestimonialById(id);
      setSelected(res?.data || null);
    } catch (err) {
      console.error("Failed to load testimonial", err);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => setSelected(null);

  if (loading) return null;

  return (
    <>
      {/* ---------------- GRID ---------------- */}
      <div className="py-8 pt-14 md:py-16 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mb-12 relative">
          {/* QUOTE ICON */}
          <img
            src="/quates.png"
            alt="Quotes"
            className="h-16 absolute -top-10 md:-left-5 left-2"
          />

          {testimonials.map((item) => (
            <div
              key={item.testimonial_id}
              onClick={() => openModal(item.testimonial_id)}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 pt-10 cursor-pointer hover:shadow-md transition"
            >
              <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-5">
                {item.content}
              </p>

              <div className="flex justify-end text-right">
                <div>
                  <p className="text-sm font-semibold text-orange-500">
                    {item.name_of_candidate}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.position_of_candidate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- PAGINATION ---------------- */}
        <div className="flex justify-center items-center gap-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 rounded-full border text-sm
              ${
                page === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100 cursor-pointer"
              }`}
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 rounded-full border text-sm
              ${
                page === totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100 cursor-pointer"
              }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* ---------------- MODAL ---------------- */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* MODAL CONTENT */}
          <div className="relative bg-white max-w-xl w-full mx-4 rounded-2xl p-6 md:p-8 animate-scaleIn">
            {/* CLOSE */}
            <button
              onClick={closeModal}
              className="absolute top-4 cursor-pointer right-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            {/* QUOTE */}
            <img src="/quates.png" alt="" className="h-14 mb-4" />

            {modalLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6">
                  {selected.content}
                </p>

                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {selected.name_of_candidate}
                  </p>
                  <p className="text-sm text-orange-500">
                    {selected.position_of_candidate}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ---------------- ANIMATION ---------------- */}
      <style jsx>{`
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
