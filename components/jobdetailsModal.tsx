"use client";

import { useEffect, useState } from "react";
import { getJobById } from "@/lib/api/careers";

export default function JobDetailsModal({ jobId, onClose, onApply }: any) {
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    getJobById(jobId).then((res) => setJob(res.data));
  }, [jobId]);

  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white max-w-2xl w-full rounded-xl p-6 animate-scaleIn">
        <h2 className="text-xl font-semibold mb-3">{job.job_title}</h2>
        <p className="text-gray-600 text-sm mb-4">{job.job_description}</p>

        <ul className="text-sm space-y-1 mb-6 text-black">
          <li>
            Location : <span className="text-gray-600">{job.job_location}</span>
          </li>
          <li>
            Job-Type : <span  className="text-gray-600">{job.job_type}</span>
          </li>
          <li>
            Exp.Level : <span  className="text-gray-600">{job.experiance_level}</span>
          </li>
          <li>
            Apply Deadline :{" "}
            <span  className="text-gray-600">
              {" "}
              {new Date(job.apply_deadline).toLocaleDateString("en-GB")}
            </span>
          </li>
        </ul>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 cursor-pointer py-2 border rounded-md"
          >
            Back
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 cursor-pointer bg-orange-500 text-white rounded-md"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
