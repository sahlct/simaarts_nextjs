"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getBlogs } from "@/lib/api/blogs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { slugify } from "@/lib/api/slugify";

interface Blog {
  blog_id: number;
  blog_title: string;
  blog_image: string;
  blog_content: string;
  publishing_date: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const LIMIT = 9;

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  /* ---------------- LOAD BLOGS ---------------- */
  const loadBlogs = async (pageNo: number) => {
    try {
      setLoading(true);
      const res = await getBlogs(pageNo, LIMIT, "", 1);
      setBlogs(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Blog fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs(page);
  }, [page]);

  /* ---------------- GSAP ---------------- */
  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-blog-title]", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.from("[data-blog-pagination]", {
        opacity: 0,
        y: 16,
        duration: 0.5,
        delay: 0.2,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="bg-white py-24 md:py-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ---------------- HEADER ---------------- */}
        <div data-blog-title className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Blogs
          </h1>
          <div className="md:w-96 w-52 h-[1px] bg-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Let us help you take a deep dive into the world of precision door making. Through these blogs
            we would like you to understand our commitment in delivering budget-friendly and sustainable
            door solutions without harming our environment.
          </p>
        </div>

        {/* ---------------- BLOG GRID ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* -------- SKELETON -------- */}
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-[220px] bg-gray-200 rounded-lg mb-4" />
                <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
                <div className="h-7 w-24 bg-gray-300 rounded-full" />
              </div>
            ))}

          {/* -------- REAL DATA -------- */}
          {!loading &&
            blogs.map((blog, index) => {
              const image = blog.blog_image
                ? base_url + blog.blog_image
                : "/placeholder.png";

              return (
                <div
                  key={blog.blog_id}
                  ref={(el) => {
                    if (el) cardsRef.current[index] = el;
                  }}
                  className="group"
                >
                  {/* IMAGE */}
                  <div className="rounded-lg overflow-hidden mb-4">
                    <Image
                      src={image}
                      alt={blog.blog_title}
                      width={400}
                      height={250}
                      className="w-full h-[220px] object-cover group-hover:scale-110 transition-all duration-300"
                    />
                  </div>

                  {/* DATE */}
                  <p className="text-xs text-orange-500 mb-1">
                    {formatDate(blog.publishing_date)}
                  </p>

                  {/* TITLE */}
                  <h3 className="font-semibold text-gray-900 text-base mb-2">
                    {blog.blog_title}
                  </h3>

                  {/* EXCERPT */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {blog.blog_content}
                  </p>

                  {/* CTA */}
                  <button
                    onClick={() =>
                      router.push(`/blogs/${slugify(blog.blog_title)}`)
                    }
                    className="bg-orange-500 cursor-pointer text-white text-xs px-4 py-1.5 rounded-full hover:bg-orange-600 transition"
                  >
                    Read More
                  </button>
                </div>
              );
            })}
        </div>

        {/* ---------------- PAGINATION ---------------- */}
        <div
          data-blog-pagination
          className="flex justify-center items-center gap-6 mt-14"
        >
          <button
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm
              ${page === 1
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-100 cursor-pointer"
              }`}
          >
            <ChevronLeft size={16} />
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => page < totalPages && setPage(page + 1)}
            disabled={page === totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm
              ${page === totalPages
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-100 cursor-pointer"
              }`}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
