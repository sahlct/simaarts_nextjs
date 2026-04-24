"use client";

import { useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import TableFilter from "@/components/filter_button";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from "@/lib/api/careers";

export default function CareersPage() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState<any>(null);

  const debouncedSearch = useDebounce(search, 500);
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const loadData = async () => {
    try {
      const status =
        filters.status && filters.status !== ""
          ? Number(filters.status)
          : undefined;
      const type =
        filters.job_type && filters.job_type !== ""
          ? String(filters.job_type)
          : undefined;
      const location =
        filters.job_location && filters.job_location !== ""
          ? String(filters.job_location)
          : undefined;

      const res = await getJobs(page, 10, debouncedSearch, status, type, location);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading jobs:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, filters]);

  return (
    <div className="p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-[#036ec6]">Careers</h1>

        <div className="flex items-center gap-3">
          <TableFilter
            fields={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Active", value: "1" },
                  { label: "Inactive", value: "0" },
                ],
              },
              {
                key: "job_type",
                label: "Job Type",
                options: [
                  { label: "Full-time", value: "Full-time" },
                  { label: "Part-time", value: "Part-time" },
                  { label: "Internship", value: "Internship" },
                  { label: "Remote", value: "Remote" },
                ],
              },
            ]}
            onChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
          />

          <button
            onClick={() => {
              setSelected(null);
              setOpenForm(true);
            }}
            className="bg-gradient-to-r from-[#036ec67c] to-[#036ec6] flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
          >
            Create Job <IconPlus size={20} />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10 },
          { key: "job_title", label: "Job Title" },
          { key: "job_location", label: "Location" },
          { key: "job_type", label: "Type" },
          {
            key: "apply_deadline",
            label: "Apply Deadline",
            render: (r) =>
              r.apply_deadline
                ? new Date(r.apply_deadline).toLocaleDateString("en-IN")
                : "—",
          },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status == 1 ? (
                <div className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Active
                </div>
              ) : (
                <div className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Inactive
                </div>
              ),
          },
          // {
          //   key: "create_at",
          //   label: "Created At",
          //   render: (r) =>
          //     r.create_at
          //       ? new Date(r.create_at).toLocaleDateString("en-IN", {
          //           year: "numeric",
          //           month: "short",
          //           day: "numeric",
          //         })
          //       : "—",
          // },
        ]}
        data={data}
        page={page}
        totalPages={totalPages}
        search={search}
        setPage={setPage}
        setSearch={setSearch}
        onEdit={(row) => {
          setSelected({
            ...row,
            status: String(row.status),
            apply_deadline: row.apply_deadline
              ? row.apply_deadline.split("T")[0]
              : "",
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={async (row) => {
          const res = await getJobById(row.job_id);
          const j = res?.data;
          if (!j) return;

          const formatted = {
            "Job Title": j.job_title || "—",
            Description: (
              <p className="text-gray-700 whitespace-pre-line">
                {j.job_description || "—"}
              </p>
            ),
            Location: j.job_location || "—",
            "Job Type": j.job_type || "—",
            "Opening Seats": j.opening_seats || "—",
            "Experience Level": j.experiance_level || "—",
            "Apply Deadline": j.apply_deadline
              ? new Date(j.apply_deadline).toLocaleDateString("en-IN")
              : "—",
            Image: j.job_image ? (
              <img
                src={base_url +j.job_image}
                alt={j.job_title}
                className="w-24 h-24 object-cover rounded-md"
              />
            ) : (
              "—"
            ),
            Status:
              j.status == 1 ? (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                  Inactive
                </span>
              ),
            "Created At": j.create_at
              ? new Date(j.create_at).toLocaleString("en-IN")
              : "—",
            "Updated At": j.update_at
              ? new Date(j.update_at).toLocaleString("en-IN")
              : "—",
          };

          setViewData(formatted);
          setOpenView(true);
        }}
      />

      {/* FORM MODAL */}
      <DynamicFormModal
        title={selected ? "Edit Job" : "Create Job"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={[
          { name: "job_title", label: "Job Title", type: "text", required: true },
          { name: "job_description", label: "Job Description", type: "textarea", required: true },
          { name: "job_location", label: "Location", type: "text", required: true },
          {
            name: "job_type",
            label: "Job Type",
            type: "select",
            options: [
              { label: "Full-time", value: "Full-time" },
              { label: "Part-time", value: "Part-time" },
              { label: "Internship", value: "Internship" },
              { label: "Remote", value: "Remote" },
            ],
            required: true,
          },
          { name: "opening_seats", label: "Opening Seats", type: "number", required: true },
          { name: "experiance_level", label: "Experience Level", type: "text", required: true },
          { name: "apply_deadline", label: "Apply Deadline", type: "date", required: true },
          { name: "job_image", label: "Job Image", type: "file", required: false },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ],
            required: true,
          },
        ]}
        defaultValues={selected}
        onSubmit={async (fd) => {
          if (selected) await updateJob(selected.job_id, fd);
          else await createJob(fd);
        }}
        onSuccess={loadData}
      />

      {/* DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteJob(selected.job_id);
            setOpenDelete(false);
            loadData();
          }
        }}
        title="Delete Job"
        message={`Are you sure you want to delete "${selected?.job_title}"?`}
      />

      {/* VIEW MODAL */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Job"
        data={viewData}
      />
    </div>
  );
}
