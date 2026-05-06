"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getBlogById } from "@/lib/api/blogs";
import { getBlogBySlug } from "@/lib/api/blogs";
import gsap from "gsap";

interface Blog {
  blog_id: number;
  blog_title: string;
  blog_image: string;
  blog_content: string;
  publishing_date: string;
  tags: string;
}

export default function BlogDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const sectionRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- LOAD BLOG ---------------- */
  useEffect(() => {
    if (!slug) return;

    const loadBlog = async () => {
      try {
        const res = await getBlogBySlug(slug);
        setBlog(res?.data || null);
      } catch (err) {
        console.error("Blog fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [slug]);

  /* ---------------- GSAP ANIMATION ---------------- */
  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-anim]", {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  /* ---------------- LOADING SKELETON ---------------- */
  if (loading) {
    return (
      <section className="bg-white py-24 md:py-28">
        <div className="max-w-4xl mx-auto px-4 md:px-6 animate-pulse">
          {/* IMAGE */}
          <div className="w-full h-[220px] sm:h-[320px] md:h-[420px] bg-gray-200 rounded-xl mb-8" />

          {/* DATE */}
          <div className="h-3 w-28 bg-gray-200 rounded mb-3" />

          {/* TITLE */}
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
          <div className="h-6 bg-gray-200 rounded w-2/4 mb-6" />

          {/* TAGS */}
          <div className="flex gap-2 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-6 w-16 bg-gray-200 rounded-full" />
            ))}
          </div>

          {/* CONTENT */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded mb-3" />
          ))}
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <div className="py-20 text-center text-gray-500">Blog not found</div>
    );
  }

  const image = blog.blog_image
    ? (blog.blog_image?.startsWith('http') ? blog.blog_image : base_url + blog.blog_image)
    : "/placeholder.png";

  const tags: string[] = Array.isArray(blog.tags) ? blog.tags : [];

  const formattedDate = new Date(blog.publishing_date).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-white py-24 md:py-28 pb-10 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* ---------------- IMAGE ---------------- */}
        <div data-anim className="rounded-xl overflow-hidden mb-8">
          <Image
            src={image}
            alt={blog.blog_title}
            width={1200}
            height={600}
            className="w-full h-[220px] sm:h-[320px] md:h-[420px] object-cover"
            priority
          />
        </div>

        {/* ---------------- META ---------------- */}
        <p data-anim className="text-sm text-orange-500 mb-2">
          {formattedDate}
        </p>

        {/* ---------------- TITLE ---------------- */}
        <h1
          data-anim
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-snug"
        >
          {blog.blog_title}
        </h1>

        {/* ---------------- TAGS ---------------- */}
        {tags.length > 0 && (
          <div data-anim className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ---------------- CONTENT ---------------- */}
        <div
          data-anim
          className="prose prose-gray max-w-none text-sm md:text-base leading-relaxed"
        >
          {blog.blog_content.split("\n").map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
