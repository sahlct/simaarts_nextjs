"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  getCustomerStories,
  getCustomerStoryById,
} from "@/lib/api/stories";

interface Story {
  stories_id: number;
  company_name: string;
  description: string;
  company_logo?: string;
  country_name?: string;
  country_flag?: string;
}

export default function SuccessStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<Story | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const LIMIT = 9;
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  // ---------------- LOAD LIST ----------------
  const loadStories = async (pageNo: number) => {
    try {
      setLoading(true);
      const res = await getCustomerStories(pageNo, LIMIT, "", 1);
      setStories(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Failed to load stories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories(page);
  }, [page]);

  // ---------------- LOAD SINGLE ----------------
  const openModal = async (id: number) => {
    try {
      setModalLoading(true);
      const res = await getCustomerStoryById(id);
      setSelected(res?.data || null);
    } catch (err) {
      console.error("Failed to load story", err);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => setSelected(null);

  if (loading) return null;

  return (
    <div className="py-16">
      {/* ================= PAGE ================= */}
      <section className="bg-white py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* -------- HEADER -------- */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Success Stories
            </h2>
            <div className="w-20 h-[1px] bg-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              Our achievements through customer success journeys
            </p>
          </div>

          {/* -------- GRID -------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {stories.map((story) => {
              const img = story.company_logo
                ? base_url + story.company_logo
                : "/placeholder.png";

              return (
                <div
                  key={story.stories_id}
                  onClick={() => openModal(story.stories_id)}
                  className="group cursor-pointer group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                >
                  {/* IMAGE */}
                  <div className="relative h-56">
                    <Image
                      src={img}
                      alt={story.company_name}
                      fill
                      className="object-cover group-hover:scale-110 transition-all duration-300 ease-in-out"
                    />

                    {/* IMAGE BOTTOM FADE */}
                    <div className="absolute inset-x-0 bottom-0 h-24 group-hover:-bottom-2.5 transition-all duration-300 ease-in-out bg-gradient-to-t from-white via-white/80 to-transparent" />
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {story.company_name}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {story.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* -------- PAGINATION -------- */}
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
      </section>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* MODAL CARD */}
          <div className="relative bg-white max-w-3xl w-full mx-4 rounded-2xl p-5 md:p-6 animate-scaleIn">
            {/* CLOSE */}
            {/* <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button> */}

            {/* IMAGE */}
            <div className="relative h-56 md:h-64 rounded-xl overflow-hidden mb-5">
              <Image
                src={
                  selected.company_logo
                    ? base_url + selected.company_logo
                    : "/placeholder.png"
                }
                alt={selected.company_name}
                fill
                className="object-cover"
              />
            </div>

            {modalLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selected.company_name}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {selected.description}
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-4 py-1.5 cursor-pointer rounded-md border text-sm hover:bg-gray-100"
                  >
                    Back
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= ANIMATION ================= */}
      <style jsx>{`
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
