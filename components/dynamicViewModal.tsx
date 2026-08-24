"use client";

import React from "react";

interface DynamicViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, React.ReactNode> | null;
}

export default function DynamicViewModal({
  isOpen,
  onClose,
  title,
  data,
}: DynamicViewModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full p-6 md:p-8 relative border border-[#EAE4D3]">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-100 text-sm font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-extrabold mb-5 text-[#2C271D] tracking-tight">{title}</h2>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          {Object.entries(data).map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between items-start border-b border-[#EAE4D3] pb-2.5 px-2"
            >
              <span className="font-extrabold text-xs uppercase tracking-wider text-[#857A68] w-[40%]">
                {label.replace(/_/g, " ")}
              </span>
              <div className="text-[#2C271D] text-xs font-bold w-[60%] text-right break-words">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
