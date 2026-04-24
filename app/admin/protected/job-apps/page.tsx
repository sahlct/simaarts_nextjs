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
  getJobApplications,
  getJobApplicationById,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
} from "@/lib/api/job-apps";
import { getJobs } from "@/lib/api/careers";

export default function JobApplicationsPage() {
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
  const [jobs, setJobs] = useState<any[]>([]);

  const debouncedSearch = useDebounce(search, 500);
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  //  Load job titles for dropdown
  const loadJobs = async () => {
    try {
      const res = await getJobs(1, 100, "", 1);
      if (res?.data) setJobs(res.data);
    } catch (err) {
      console.error("Error loading jobs:", err);
    }
  };

  //  Load applications
  const loadData = async () => {
    try {
      const status =
        filters.status && filters.status !== ""
          ? Number(filters.status)
          : undefined;
      const application_status =
        filters.application_status && filters.application_status !== ""
          ? Number(filters.application_status)
          : undefined;

      const res = await getJobApplications(
        page,
        10,
        debouncedSearch,
        status,
        application_status
      );
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading applications:", err);
    }
  };

  useEffect(() => {
    loadJobs();
    loadData();
  }, [page, debouncedSearch, filters]);

  return (
    <div className="p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-[#036ec6]">
          Job Applications
        </h1>

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
                key: "application_status",
                label: "Application Status",
                options: [
                  { label: "Requested", value: "1" },
                  { label: "Ongoing", value: "2" },
                  { label: "Closed", value: "3" },
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
            className="bg-gradient-to-r from-[#036ec67c] to-[#036ec6] flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:opacity-90"
          >
            Create Application <IconPlus size={20} />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          { key: "candidate_name", label: "Candidate Name" },
          { key: "candidate_email", label: "Email" },
          { key: "candidate_phone", label: "Phone" },
          {
            key: "Job",
            label: "Job Title",
            render: (r) => r?.Job?.job_title || "—",
          },
          {
            key: "application_date",
            label: "Date",
            render: (r) =>
              r.application_date
                ? new Date(r.application_date).toLocaleDateString("en-IN")
                : "—",
          },
           {
            key: "application_status",
            label: "Application Status",
            render: (r) =>
              r.application_status === 1 ? (
                <div className="bg-orange-100 text-orange-800 w-fit px-3 py-0.5 rounded-full text-xs font-medium">
                  Requested
                </div>
              ) : r.application_status === 2 ? (
                <div className="bg-yellow-100 text-yellow-800 w-fit px-3 py-0.5 rounded-full text-xs font-medium">
                  Ongoing
                </div>
              ) : (
                <div className="bg-green-100 text-green-800 w-fit px-3 py-0.5 rounded-full text-xs font-medium">
                  closed
                </div>
              ),
          },
          // {
          //   key: "status",
          //   label: "Status",
          //   render: (r) =>
          //     r.status == 1 ? (
          //       <div className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">
          //         Active
          //       </div>
          //     ) : (
          //       <div className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full">
          //         Inactive
          //       </div>
          //     ),
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
            application_status: String(row.application_status),
            job_id: row.job_id,
            application_date: row.application_date
              ? row.application_date.split("T")[0]
              : "",
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={async (row) => {
          const res = await getJobApplicationById(row.application_id);
          const a = res?.data;
          if (!a) return;

          const statusMap: Record<number, string> = {
            1: "Requested",
            2: "Ongoing",
            3: "Closed",
          };

          const formatted = {
            "Candidate Name": a.candidate_name || "—",
            Email: a.candidate_email || "—",
            Phone: a.candidate_phone || "—",
            Address: a.candidate_address || "—",
            "Job Title": a?.Job?.job_title || "—",
            "Cover Letter": (
              <p className="text-gray-700 whitespace-pre-line">
                {a.cover_letter || "—"}
              </p>
            ),
            "Application Status": statusMap[a.application_status] || "—",
            "Application Date": a.application_date
              ? new Date(a.application_date).toLocaleDateString("en-IN")
              : "—",
            "Resume File": a.resume_file ? (
              <a
                href={base_url + a.resume_file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Resume
              </a>
            ) : (
              "—"
            ),
            Status:
              a.status == 1 ? (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                  Inactive
                </span>
              ),
            "Created At": a.create_at
              ? new Date(a.create_at).toLocaleString("en-IN")
              : "—",
            "Updated At": a.update_at
              ? new Date(a.update_at).toLocaleString("en-IN")
              : "—",
          };

          setViewData(formatted);
          setOpenView(true);
        }}
      />

      {/* FORM MODAL */}
      <DynamicFormModal
        title={selected ? "Edit Job Application" : "Create Job Application"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={[
          { name: "candidate_name", label: "Candidate Name", type: "text", required: true },
          { name: "candidate_email", label: "Email", type: "email", required: true },
          { name: "candidate_phone", label: "Phone", type: "text", required: true },
          { name: "candidate_address", label: "Address", type: "text", required: true },
          {
            name: "job_id",
            label: "Select Job",
            type: "select",
            options: jobs.map((j) => ({
              label: j.job_title,
              value: String(j.job_id),
            })),
            required: true,
          },
          { name: "cover_letter", label: "Cover Letter", type: "textarea", required: false },
          {
            name: "application_status",
            label: "Application Status",
            type: "select",
            options: [
              { label: "Requested", value: "1" },
              { label: "Ongoing", value: "2" },
              { label: "Closed", value: "3" },
            ],
            required: true,
          },
          { name: "application_date", label: "Application Date", type: "date", required: true },
          { name: "resume_file", label: "Resume File (PDF)", type: "file", required: false },
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
          if (selected) await updateJobApplication(selected.application_id, fd);
          else await createJobApplication(fd);
        }}
        onSuccess={loadData}
      />

      {/* DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteJobApplication(selected.application_id);
            setOpenDelete(false);
            loadData();
          }
        }}
        title="Delete Job Application"
        message={`Are you sure you want to delete "${selected?.candidate_name}"?`}
      />

      {/* VIEW MODAL */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Job Application"
        data={viewData}
      />
    </div>
  );
}
