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
  getCustomerStories,
  getCustomerStoryById,
  createCustomerStory,
  updateCustomerStory,
  deleteCustomerStory,
} from "@/lib/api/stories";

export default function CustomerStoriesPage() {
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
      const res = await getCustomerStories(page, 10, debouncedSearch, status);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading customer stories:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, filters]);

  return (
    <div className="p-4 sm:p-6">
      {/* ========== HEADER ========== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-bold text-[#2C271D]">Customer Stories</h1>

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
            className="bg-[#4A4229] hover:bg-[#3D3622] text-[#FAF8F3] font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            Create Story <IconPlus size={18} />
          </button>
        </div>
      </div>

      {/* ========== TABLE ========== */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          {
            key: "company_logo",
            label: "Logo",
            render: (r) =>
              r.company_logo ? (
                <img
                  src={r.company_logo?.startsWith('http') ? r.company_logo : base_url + r.company_logo}
                  alt={r.company_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                "—"
              ),
          },
          { key: "company_name", label: "Company Name" },
          { key: "country_name", label: "Country" },
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
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={async (row) => {
          const res = await getCustomerStoryById(row.stories_id);
          const s = res?.data;
          if (!s) return;

          const formatted = {
            "Company Name": s.company_name || "—",
            "Company URL": (
              <a
                href={`https://${s.company_url}`}
                target="_blank"
                className="text-blue-600 underline"
              >
                {s.company_url || "—"}
              </a>
            ),
            Description: (
              <p className="text-gray-700 whitespace-pre-line">
                {s.description || "—"}
              </p>
            ),
            "Country Name": s.country_name || "—",
            "Company Logo": s.company_logo ? (
              <img
                src={s.company_logo?.startsWith('http') ? s.company_logo : base_url + s.company_logo}
                alt={s.company_name}
                className="w-20 h-20 object-cover rounded"
              />
            ) : (
              "—"
            ),
            "Country Flag": s.country_flag ? (
              <img
                src={s.country_flag?.startsWith('http') ? s.country_flag : base_url + s.country_flag}
                alt={s.country_name}
                className="w-12 h-8 object-cover rounded"
              />
            ) : (
              "—"
            ),
            Status:
              s.status == 1 ? (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                  Inactive
                </span>
              ),
            "Created At": s.create_at
              ? new Date(s.create_at).toLocaleString("en-IN")
              : "—",
            "Updated At": s.update_at
              ? new Date(s.update_at).toLocaleString("en-IN")
              : "—",
          };

          setViewData(formatted);
          setOpenView(true);
        }}
      />

      {/* ========== FORM MODAL ========== */}
      <DynamicFormModal
        title={selected ? "Edit Story" : "Create Story"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={[
          { name: "company_name", label: "Company Name", type: "text", required: true },
          { name: "company_url", label: "Company URL", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "country_name", label: "Country Name", type: "text", required: true },
          { name: "company_logo", label: "Company Logo", type: "file", required: false },
          { name: "country_flag", label: "Country Flag", type: "file", required: false },
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
          if (selected) await updateCustomerStory(selected.stories_id, fd);
          else await createCustomerStory(fd);
        }}
        onSuccess={loadData}
      />

      {/* ========== DELETE MODAL ========== */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteCustomerStory(selected.stories_id);
            setOpenDelete(false);
            loadData();
          }
        }}
        title="Delete Story"
        message={`Are you sure you want to delete "${selected?.company_name}"?`}
      />

      {/* ========== VIEW MODAL ========== */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Customer Story"
        data={viewData}
      />
    </div>
  );
}
