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
  getShorts,
  getShortById,
  createShort,
  updateShort,
  deleteShort,
} from "@/lib/api/shorts";

export default function ShortsPage() {
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
      const type = filters.type || undefined;

      const res = await getShorts(page, 10, debouncedSearch, status, type);

      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading shorts:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, filters]);

  return (
    <div className="p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-[#036ec6]">Shorts</h1>

        <div className="flex items-center gap-3">
          <TableFilter
            fields={[
              {
                key: "type",
                label: "Type",
                options: [
                  { label: "YouTube", value: "youtube" },
                  { label: "Instagram", value: "insta" },
                ],
              },
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
            Create Short <IconPlus size={20} />
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
            key: "thumbnail_image",
            label: "Thumbnail",
            render: (r) =>
              r.thumbnail_image ? (
                <img
                  src={base_url + r.thumbnail_image}
                  alt={r.shorts_title}
                  className="w-10 h-10 object-cover rounded-md"
                />
              ) : (
                "—"
              ),
          },
          { key: "shorts_title", label: "Title" },
          {
            key: "shorts_type",
            label: "Type",
            render: (r) => (
              <span className="capitalize font-medium text-gray-700">
                {r.shorts_type === "youtube" ? "YouTube" : "Instagram"}
              </span>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status == 1 || r.status == "1" ? (
                <div className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full text-xs">
                  Active
                </div>
              ) : (
                <div className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full text-xs">
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
          const res = await getShortById(row.shorts_id);
          const s = res?.data;

          const formatted = {
            Title: s.shorts_title || "—",
            Subtitle: s.shorts_subtitle || "—",
            Type: (
              <span className="capitalize">
                {s.shorts_type === "youtube" ? "YouTube" : "Instagram"}
              </span>
            ),
            "Video URL": (
              <a
                href={s.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {s.video_url}
              </a>
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
            Thumbnail: s.thumbnail_image ? (
              <div className="flex justify-end">
                <img
                  src={base_url + s.thumbnail_image}
                  alt="Thumbnail"
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
        title={selected ? "Edit Short" : "Create Short"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={[
          {
            name: "shorts_title",
            label: "Short Title",
            type: "text",
            required: true,
          },
          {
            name: "shorts_subtitle",
            label: "Short Subtitle",
            type: "text",
          },
          {
            name: "shorts_type",
            label: "Short Type",
            type: "select",
            options: [
              { label: "YouTube", value: "youtube" },
              { label: "Instagram", value: "insta" },
            ],
            required: true,
          },
          {
            name: "video_url",
            label: "Video URL",
            type: "text",
            required: true,
            placeholder: "https://youtube.com/shorts/... or instagram.com/reels/...",
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
          { name: "thumbnail_image", label: "Thumbnail Image", type: "file" },
        ]}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateShort(selected.shorts_id, fd);
          else await createShort(fd);
        }}
        onSuccess={loadData}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Delete Short"
        message={`Are you sure you want to delete "${selected?.shorts_title}"?`}
        onConfirm={async () => {
          if (selected) {
            await deleteShort(selected.shorts_id);
            setOpenDelete(false);
            loadData();
          }
        }}
      />

      {/* View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Short"
        data={viewData}
      />
    </div>
  );
}
