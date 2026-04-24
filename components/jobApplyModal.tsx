"use client";

import { useState } from "react";
import { createJobApplication } from "@/lib/api/job-apps";
import { useToast } from "@/contexts/ToastContext";
import { Upload, X } from "lucide-react";

export default function JobApplyModal({ jobId, onClose }: any) {
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const submit = async () => {
    if (!form.name.trim()) return showError("Name is required");
    if (!form.phone.trim()) return showError("Phone number is required");
    if (!form.address.trim()) return showError("Address is required");
    if (!file) return showError("Resume file is required");

    const fd = new FormData();
    fd.append("candidate_name", form.name);
    fd.append("candidate_email", form.email);
    fd.append("candidate_phone", form.phone);
    fd.append("candidate_address", form.address);
    fd.append("cover_letter", form.message);
    fd.append("job_id", String(jobId));
    fd.append("resume_file", file);

    try {
      setLoading(true);
      await createJobApplication(fd);
      showSuccess("Application submitted successfully!");
      onClose();
    } catch (err: any) {
      showError(`Failed, ${err?.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      {/* MODAL */}
      <div className="bg-white max-w-xl w-full rounded-2xl p-6 md:p-8 animate-scaleIn relative">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-6">Apply for Job</h2>

        {/* FORM */}
        <div className="space-y-4">
          {/* NAME */}
          <input
            placeholder="Full Name *"
            className="w-full border border-gray-200 bg-gray-50 px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-orange-400 outline-none"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* EMAIL */}
          <input
            placeholder="Email Address"
            type="email"
            className="w-full border border-gray-200 bg-gray-50 px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-orange-400 outline-none"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* PHONE */}
          <input
            placeholder="Phone Number *"
            className="w-full border border-gray-200 bg-gray-50 px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-orange-400 outline-none"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          {/* ADDRESS */}
          <textarea
            placeholder="Address *"
            rows={2}
            className="w-full border border-gray-200 bg-gray-50 px-4 py-2 rounded-md text-sm resize-none focus:ring-2 focus:ring-orange-400 outline-none"
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          {/* COVER LETTER */}
          <textarea
            placeholder="Cover Letter / Message"
            rows={3}
            className="w-full border border-gray-200 bg-gray-50 px-4 py-2 rounded-md text-sm resize-none focus:ring-2 focus:ring-orange-400 outline-none"
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />

          {/* FILE UPLOAD */}
          <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
            <label className="cursor-pointer flex flex-col items-center gap-2">
              <Upload className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-600">
                {file ? "Change Resume" : "Upload Resume (PDF only)"}
              </span>

              <input
                type="file"
                accept=".pdf"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>

            {file && (
              <p className="mt-2 text-xs text-gray-500 truncate">
                Selected file: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border cursor-pointer rounded-md text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-5 py-2 cursor-pointer bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
