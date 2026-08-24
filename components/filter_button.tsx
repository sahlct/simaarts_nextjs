"use client";

import { useEffect, useRef, useState } from "react";
import { IconFilter } from "@tabler/icons-react";

interface FilterOption {
  label: string;
  value: string | number;
}

interface FilterField {
  key: string;
  label: string;
  type?: "select" | "date" | "year";
  options?: FilterOption[];
  showIf?: {
    field: string;
    value: string | number;
  };
}

interface TableFilterProps {
  fields: FilterField[];
  onChange: (filters: Record<string, string>) => void;
}

export default function TableFilter({ fields, onChange }: TableFilterProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const filterRef = useRef<HTMLDivElement>(null);

  //  Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //  Trigger change when filters update
  useEffect(() => {
    onChange(filters);
  }, [filters]);

  //  Conditional visibility
  const shouldShowField = (field: FilterField) => {
    if (!field.showIf) return true;
    const targetValue = filters[field.showIf.field];
    return targetValue === String(field.showIf.value);
  };

  //   Extract only the year from "YYYY-MM" value
  const extractYear = (monthValue: string) => monthValue?.split("-")[0] || "";

  return (
    <div className="relative" ref={filterRef}>
      {/* Filter Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer bg-[#FAF8F3] hover:bg-white hover:border-[#D5C58A] text-[#2C271D] border border-[#EAE4D3] px-4 py-2.5 rounded-xl shadow-xs transition-all font-bold text-xs uppercase tracking-wider"
      >
        <IconFilter size={16} className="text-[#8C7E4F]" />
        <span className="hidden sm:inline">Filters</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-[#EAE4D3] rounded-2xl shadow-xl p-4 z-50 animate-in fade-in duration-200">
          <div className="flex flex-col gap-3">
            {fields
              .filter((field) => shouldShowField(field))
              .map((field) => (
                <div key={field.key}>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#857A68] mb-1">
                    {field.label}
                  </label>

                  {/*  Normal Date Picker */}
                  {field.type === "date" && (
                    <input
                      type="date"
                      value={filters[field.key] ?? ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                      className="mt-1 w-full bg-[#FAF8F3] border border-[#EAE4D3] rounded-xl p-2.5 text-xs font-bold text-[#2C271D] focus:bg-white focus:ring-2 focus:ring-[#D5C58A] focus:border-[#D5C58A] outline-none"
                    />
                  )}

                  {/*  Year-Only Picker */}
                  {field.type === "year" && (
                    <input
                      type="month"
                      value={
                        filters[field.key]
                          ? `${filters[field.key]}-01`
                          : ""
                      }
                      onChange={(e) => {
                        const year = extractYear(e.target.value);
                        setFilters((prev) => ({
                          ...prev,
                          [field.key]: year,
                        }));
                      }}
                      className="mt-1 w-full bg-[#FAF8F3] border border-[#EAE4D3] rounded-xl p-2.5 text-xs font-bold text-[#2C271D] focus:bg-white focus:ring-2 focus:ring-[#D5C58A] focus:border-[#D5C58A] outline-none"
                      onFocus={(e) => e.target.showPicker?.()}
                    />
                  )}

                  {/*  Select Dropdown */}
                  {(!field.type || field.type === "select") && (
                    <select
                      value={filters[field.key] ?? ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                      className="mt-1 w-full bg-[#FAF8F3] border border-[#EAE4D3] rounded-xl p-2.5 text-xs font-bold text-[#2C271D] focus:bg-white focus:ring-2 focus:ring-[#D5C58A] focus:border-[#D5C58A] outline-none"
                    >
                      <option value="">All</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
