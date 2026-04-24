"use client";

import { useEffect, useState } from "react";
import { IconPlus, IconPencil, IconTrash } from "@tabler/icons-react";
import TableFilter from "@/components/filter_button";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";

import {
  getGallery,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery,
} from "@/lib/api/gallery";

export default function GalleryPage() {
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

  /** =========================
   * LOAD DATA
   * ========================= */
  const loadData = async () => {
    try {
      const status =
        filters.status && filters.status !== ""
          ? Number(filters.status)
          : undefined;

      const res = await getGallery(page, 12, debouncedSearch, status);

      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Gallery load error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, filters]);

  /** =========================
   * HANDLE VIEW
   * ========================= */
  const handleView = async (row: any) => {
    const res = await getGalleryById(row.gallery_id);
    if (!res?.data) return;

    const g = res.data;

    const formatted = {
      "Gallery Title": g.gallery_title || "—",
      "Media File": (
        <a
          href={g.media_file}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Open File
        </a>
      ),
      "Meta Data": (
        <pre className="text-gray-700 bg-gray-100 p-2 rounded">
          {JSON.stringify(JSON.parse(g.meta_data || "{}"), null, 2)}
        </pre>
      ),
      Status:
        g.status == 1 ? (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
            Active
          </span>
        ) : (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
            Inactive
          </span>
        ),
      "Created At": g.create_at
        ? new Date(g.create_at).toLocaleString("en-IN")
        : "—",
      "Updated At": g.update_at
        ? new Date(g.update_at).toLocaleString("en-IN")
        : "—",
    };

    setViewData(formatted);
    setOpenView(true);
  };

  /** =========================
   * RENDER MEDIA PREVIEW
   * ========================= */
  const renderPreview = (fileUrl: string) => {
    const ext = fileUrl.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext || ""))
      return (
        <img
          src={fileUrl}
          className="w-full h-40 object-cover rounded-t-lg"
          alt="media"
        />
      );

    if (["mp4", "mov", "webm"].includes(ext || ""))
      return (
        <video
          src={fileUrl}
          className="w-full h-40 object-cover rounded-t-lg"
          controls
        />
      );

    return (
      <div className="w-full h-40 flex items-center justify-center bg-gray-200 text-gray-600">
        File
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-[#3d3c98]">Gallery</h1>

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
            className="bg-gradient-to-r from-[#3d3c98] to-[#0b6dac] flex items-center gap-2 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-cyan-800"
          >
            Create Data <IconPlus size={20} />
          </button>
        </div>
      </div>

      {/* ================== GRID ================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-10">
        {data.map((item: any, i: number) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-lg border cursor-pointer hover:shadow-lg transition relative"
          >
            {/* Click opens file */}
            <div onClick={() => window.open(item.media_file, "_blank")}>
              {renderPreview(item.media_file)}
            </div>

            <div className="p-3">
              {/* <p className="text-sm text-gray-600">
                {item.meta_data
                  ? JSON.stringify(JSON.parse(item.meta_data))
                  : "—"}
              </p> */}

              <div className="mt-2 flex justify-between">
                <h3 className="text-md font-semibold">{item.gallery_title}</h3>
                <div>
                  {item.status == 1 ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Edit + Delete Icons */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected({
                    ...item,
                    status: String(item.status),
                    meta_data: item.meta_data,
                  });
                  setOpenForm(true);
                }}
                className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
              >
                <IconPencil size={18} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(item);
                  setOpenDelete(true);
                }}
                className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
              >
                <IconTrash size={18} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-medium">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* ================= FORM MODAL ================= */}
      <DynamicFormModal
        title={selected ? "Edit Gallery Item" : "Create Gallery Item"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={[
          {
            name: "gallery_title",
            label: "Title",
            type: "text",
            required: false,
          },
          { name: "meta_data", label: "Meta Data (JSON)", type: "textarea" },
          {
            name: "media_file",
            label: "Media File",
            type: "file",
            required: !selected,
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            options: [
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" },
            ],
          },
        ]}
        defaultValues={selected}
        onSubmit={async (fd) => {
          if (selected) await updateGallery(selected.gallery_id, fd);
          else await createGallery(fd);
        }}
        onSuccess={loadData}
      />

      {/* ================= DELETE MODAL ================= */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteGallery(selected.gallery_id);
            setOpenDelete(false);
            loadData();
          }
        }}
        title="Delete Gallery Item"
        message={`Are you sure you want to delete "${selected?.gallery_title}"?`}
      />

      {/* ================= VIEW MODAL ================= */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Gallery Item"
        data={viewData}
      />
    </div>
  );
}
