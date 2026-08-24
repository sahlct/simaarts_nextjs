"use client";

import { X } from "lucide-react";
import { apiRequest } from "@/lib/api/apiClients";
import { useState } from "react";
import { useToast } from "@/contexts/ToastContext";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  endpoint?: string; 
  id?: number | string;
  onConfirm?: () => Promise<void> | void; 
  onSuccess?: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item?",
  endpoint,
  id,
  onConfirm,
  onSuccess,
}: ConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showInfo, showError } = useToast();

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      if (onConfirm) {
        await onConfirm();
      } else if (endpoint && id !== undefined) {
        await apiRequest(`${endpoint}/${id}`, "DELETE");
      } else {
        throw new Error("No delete handler or endpoint provided.");
      }

      onSuccess?.();
      showInfo("Deleted successfully");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to delete");
      showError(err.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-6 md:p-8 relative border border-[#EAE4D3]">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-extrabold text-[#2C271D] mb-2">{title}</h2>
        <p className="text-xs font-medium text-[#5A5243] mb-6 leading-relaxed">{message}</p>

        {error && <p className="bg-red-50 text-red-700 p-2.5 rounded-xl border border-red-200 text-xs font-semibold mb-4">{error}</p>}

        <div className="flex justify-end items-center gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 cursor-pointer rounded-xl border border-[#EAE4D3] text-xs font-bold text-[#2C271D] bg-[#FAF8F3] hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2 cursor-pointer rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
