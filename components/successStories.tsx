"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getCustomerStories, getCustomerStoryById } from "@/lib/api/stories";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Story {
  stories_id: number;
  company_name: string;
  company_url: string;
  company_logo: string;
  description: string;
  country_name: string;
  country_flag: string;
}

export default function SuccessStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [selected, setSelected] = useState<Story | null>(null);
  const router = useRouter();
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const closeModal = () => setSelected(null);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const res = await getCustomerStories(1, 5, "", 1);
        setStories(res?.data || []);
      } catch (err) {
        console.error("Failed to load stories", err);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

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

  if (loading) return null;

  return (
    <section className="bg-gradient-to-b from-[#0f130c] to-[#1a1f15] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ---------------- HEADER ---------------- */}
        <div className="mb-10 max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Success Stories
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Real achievements that define our commitment to quality, precision,
            and long-term trust. Each milestone reflects our dedication to
            excellence.
          </p>
        </div>

        {/* ---------------- GRID ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* LEFT TALL IMAGE */}
          {stories[0] && (
            <div
              onClick={() => openModal(stories[0].stories_id)}
              className="md:row-span-2 row-span-1 relative rounded-xl overflow-hidden cursor-pointer group"
            >
              <Image
                src={(stories[0].company_logo?.startsWith('http') ? stories[0].company_logo : base_url + stories[0].company_logo)}
                alt={stories[0].company_name}
                fill
                className="object-cover group-hover:scale-110 transition-all duration-300 ease-in-out"
              />
              <StoryOverlay story={stories[0]} />
            </div>
          )}

          {/* TOP WIDE IMAGE */}
          {stories[1] && (
            <div
              onClick={() => openModal(stories[1].stories_id)}
              className="md:col-span-3 cursor-pointer group relative rounded-xl overflow-hidden h-[220px]"
            >
              <Image
                src={(stories[1].company_logo?.startsWith('http') ? stories[1].company_logo : base_url + stories[1].company_logo)}
                alt={stories[1].company_name}
                fill
                className="object-cover group-hover:scale-110 transition-all duration-300 ease-in-out"
              />
              <StoryOverlay story={stories[1]} />
            </div>
          )}

          {/* SMALL IMAGE */}
          {stories[2] && (
            <div
              onClick={() => openModal(stories[2].stories_id)}
              className="relative cursor-pointer rounded-xl overflow-hidden h-[220px] group"
            >
              <Image
                src={(stories[2].company_logo?.startsWith('http') ? stories[2].company_logo : base_url + stories[2].company_logo)}
                alt={stories[2].company_name}
                fill
                className="object-cover group-hover:scale-110 transition-all duration-300 ease-in-out"
              />
              <StoryOverlay story={stories[2]} />
            </div>
          )}

          {stories[4] && (
            <div
              onClick={() => openModal(stories[4].stories_id)}
              className="bg-[#f5b400] cursor-pointer rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  {stories[4].company_name}
                </h4>
                <p className="text-sm text-gray-800 leading-relaxed line-clamp-6">
                  {stories[4].description}
                </p>
              </div>
            </div>
          )}

          {stories[3] && (
            <div
              onClick={() => openModal(stories[3].stories_id)}
              className="relative cursor-pointer rounded-xl overflow-hidden h-[220px] group"
            >
              <Image
                src={(stories[3].company_logo?.startsWith('http') ? stories[3].company_logo : base_url + stories[3].company_logo)}
                alt={stories[3].company_name}
                fill
                className="object-cover group-hover:scale-110 transition-all duration-300 ease-in-out"
              />
              <StoryOverlay story={stories[3]} />
            </div>
          )}
        </div>

        {/* ---------------- CTA ---------------- */}
        <div className="flex justify-center mt-10">
          <Button
            onClick={() => router.push("/success-stories")}
            className="rounded-full px-6 py-2 text-sm bg-white text-black hover:bg-gray-200 cursor-pointer"
          >
            View All Success Stories
          </Button>
        </div>
      </div>

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
                    ? (selected.company_logo?.startsWith('http') ? selected.company_logo : base_url + selected.company_logo)
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
    </section>
  );
}

/* ---------------- OVERLAY COMPONENT ---------------- */

function StoryOverlay({ story }: { story: Story }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
      <p className="text-xs text-gray-300 mb-1">{story.country_name}</p>
      <h4 className="text-white font-semibold text-sm">{story.company_name}</h4>
    </div>
  );
}
