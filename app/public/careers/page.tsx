"use client";

import { useEffect, useRef, useState } from "react";
import { getJobs } from "@/lib/api/careers";
import { useDebounce } from "@/hooks/debounce";
import JobDetailsModal from "../../../components/jobdetailsModal";
import JobApplyModal from "../../../components/jobApplyModal";
import gsap from "gsap";

interface Job {
  job_id: number;
  job_title: string;
  job_location: string;
  job_type: string;
  opening_seats: number;
  experiance_level: string;
  apply_deadline: string;
  job_image?: string;
}

export default function CareerPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openApply, setOpenApply] = useState(false);

  const LIMIT = 6;

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await getJobs(page, LIMIT, debouncedSearch, 1);
      setJobs(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [page, debouncedSearch]);

  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header
      gsap.from("[data-career-header]", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
      });

      // Cards
      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      });

      // Pagination
      gsap.from("[data-career-pagination]", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        delay: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, jobs]);

  return (
    <div className="md:py-16 py-8">
      <section
        ref={sectionRef}
        className="py-16 bg-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div
            data-career-header
            className="text-center mb-10"
          >
            <h1 className="text-2xl md:text-4xl font-bold">
              Careers at SS Enterprises
            </h1>
            <div className="md:w-96 w-52 h-[1px] bg-gray-300 mx-auto my-3" />
            <p className="text-sm text-gray-500">
              Explore opportunities and grow your career with us
            </p>
          </div>

          <div className="flex justify-end mb-6">
            <input
              placeholder="Search job title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-72 px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {loading && (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border shadow-sm p-5 flex justify-between animate-pulse">
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="h-8 w-24 bg-gray-200 rounded" />
                    <div className="h-8 w-24 bg-gray-300 rounded" />
                  </div>
                </div>
              ))
            )}

            {/* no data */}
            {!loading && jobs.length === 0 && (
              <div className="col-span-2 flex flex-col items-center justify-center md:py-0 py-12">
                <img src="/no_data.png" alt="No data" className="opacity-30 w-1/2 max-w-sm md:max-w-sm" />
              </div>
            )}


            {!loading && jobs.length > 0 && (
              jobs.map((job, index) => {
                const imageUrl = job.job_image
                  ? `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${job.job_image}`
                  : "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=200&h=200&auto=format&fit=crop";

                return (
                  <div
                    key={job.job_id}
                    ref={(el) => {
                      if (el) cardsRef.current[index] = el;
                    }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-all group"
                  >
                    <div className="w-full sm:w-32 h-32 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      <img
                        src={imageUrl}
                        alt={job.job_title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=200&h=200&auto=format&fit=crop";
                        }}
                      />
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="mb-2">
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                          {job.job_title}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                            📍 {job.job_location}
                          </span>
                          <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-tight">
                            {job.job_type}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-[13px] text-gray-600 mt-1">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-400 uppercase font-medium">Seats</span>
                          <span>{job.opening_seats} Available</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-400 uppercase font-medium">Experience</span>
                          <span>{job.experiance_level}</span>
                        </div>
                        <div className="col-span-2 border-t border-gray-50 flex items-center justify-between">
                          <span className="text-xs text-gray-400">Deadline: {new Date(job.apply_deadline).toLocaleDateString("en-GB")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-end sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 sm:pl-3 border-gray-100">
                      <button
                        onClick={() => {
                          setSelectedJobId(job.job_id);
                          setOpenDetails(true);
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 cursor-pointer border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 transition-colors whitespace-nowrap"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => {
                          setSelectedJobId(job.job_id);
                          setOpenApply(true);
                        }}
                        className="flex-1 sm:flex-none px-6 py-2 cursor-pointer bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 shadow-sm shadow-orange-200 hover:shadow-orange-300 transition-all whitespace-nowrap"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {(!loading && jobs.length > 0) && (
            <div
              data-career-pagination
              className="flex justify-center gap-6 items-center"
            >
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={`px-4 py-2 rounded-full border ${page === 1
                  ? "cursor-not-allowed text-gray-400"
                  : "cursor-pointer hover:bg-gray-100"
                  }`}
              >
                Prev
              </button>

              <span className="text-sm">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className={`px-4 py-2 rounded-full border ${page === totalPages
                  ? "cursor-not-allowed text-gray-400"
                  : "cursor-pointer hover:bg-gray-100"
                  }`}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/*  modals */}
        {openDetails && selectedJobId && (
          <JobDetailsModal
            jobId={selectedJobId}
            onClose={() => setOpenDetails(false)}
            onApply={() => {
              setOpenDetails(false);
              setOpenApply(true);
            }}
          />
        )}

        {openApply && selectedJobId && (
          <JobApplyModal
            jobId={selectedJobId}
            onClose={() => setOpenApply(false)}
          />
        )}
      </section>
    </div>
  );
}
