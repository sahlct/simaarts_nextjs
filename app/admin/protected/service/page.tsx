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
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "@/lib/api/service";

export default function ServicePage() {
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

      const res = await getServices(page, 10, debouncedSearch, status);

      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading services:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, filters]);

  return (
    <div className="p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-[#036ec6]">Services</h1>

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
            className="bg-gradient-to-r from-[#036ec67c] to-[#036ec6] border border-gray-300 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
          >
            Create Service <IconPlus size={20} />
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          {
            key: "service_image",
            label: "Image",
            render: (r) =>
              r.service_image ? (
                <img
                  src={r.service_image?.startsWith('http') ? r.service_image : base_url + r.service_image}
                  alt={r.service_title}
                  className="w-10 h-10 object-cover rounded-md"
                />
              ) : (
                "—"
              ),
          },
          { key: "service_title", label: "Title" },
          {
            key: "service_description",
            label: "Description",
            render: (r) => {
              const desc = r.service_description?.trim();
              if (!desc) return "—";

              return (
                <div className="truncate max-w-[250px]" title={desc}>
                  {desc}
                </div>
              );
            },
          },

          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status == 1 || r.status == "1" ? (
                <div className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Active
                </div>
              ) : (
                <div className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Inactive
                </div>
              ),
          },
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
          const res = await getServiceById(row.service_id);
          const s = res?.data;
          if (!s) return;

          const formatted = {
            "Service Title": s.service_title || "—",
            Description: (
              <p className="text-gray-700 whitespace-pre-line">
                {s.service_description || "—"}
              </p>
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
            "Service Image": s.service_image ? (
              <div className="flex justify-end">
                <img
                  src={s.service_image?.startsWith('http') ? s.service_image : base_url + s.service_image}
                  alt="Service"
                  className="w-14 h-14 object-cover rounded"
                />
              </div>
            ) : (
              "—"
            ),
            "Created At": s.created_at
              ? new Date(s.created_at).toLocaleString("en-IN")
              : "—",
            "Updated At": s.updated_at
              ? new Date(s.updated_at).toLocaleString("en-IN")
              : "—",
          };

          setViewData(formatted);
          setOpenView(true);
        }}
      />

      {/* Form Modal */}
      <DynamicFormModal
        title={selected ? "Edit Service" : "Create Service"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={[
          {
            name: "service_title",
            label: "Service Title",
            type: "text",
            required: true,
          },
          {
            name: "service_description",
            label: "Description",
            type: "textarea",
            required: true,
          },
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
          { name: "service_image", label: "Service Image", type: "file" },
        ]}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateService(selected.service_id, fd);
          else await createService(fd);
        }}
        onSuccess={loadData}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Delete Service"
        message={`Are you sure you want to delete "${selected?.service_title}"?`}
        onConfirm={async () => {
          if (selected) {
            await deleteService(selected.service_id);
            setOpenDelete(false);
            loadData();
          }
        }}
      />

      {/* View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Service"
        data={viewData}
      />
    </div>
  );
}
