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
  getCarousels,
  getCarouselById,
  createCarousel,
  updateCarousel,
  deleteCarousel,
} from "@/lib/api/carousel";

export default function CarouselPage() {
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

  const isVideoFile = (file: string) => /\.(mp4|webm|ogg|mov)$/i.test(file);

  const openVideo = (file: string) => {
    const fullUrl = encodeURIComponent((base_url ?? "") + file);
    window.open(`/video-player?src=${fullUrl}`, "_blank");
  };

  const loadData = async () => {
    try {
      const status =
        filters.status && filters.status !== ""
          ? Number(filters.status)
          : undefined;

      const res = await getCarousels(page, 10, debouncedSearch, status);

      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading carousels:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, filters]);

  return (
    <div className="p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-[#036ec6]">Carousel</h1>

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
            Create Carousel <IconPlus size={20} />
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
            key: "desktop_background",
            label: "Desktop File",
            render: (r) => {
              const file = r.desktop_background;
              if (!file) return "—";
              const isVideo = isVideoFile(file);
              return isVideo ? (
                <div
                  className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                  title="Click to play video"
                  onClick={(e) => {
                    e.stopPropagation();
                    openVideo(file);
                  }}
                >
                  <span className="text-white text-xs">▶</span>
                </div>
              ) : (
                <img
                  src={file?.startsWith('http') ? file : base_url + file}
                  alt={r.carousel_title}
                  className="w-10 h-10 object-cover rounded-md"
                />
              );
            },
          },
          {
            key: "mobile_background",
            label: "Mobile File",
            render: (r) => {
              const file = r.mobile_background;
              if (!file) return "—";
              const isVideo = isVideoFile(file);
              return isVideo ? (
                <div
                  className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                  title="Click to play video"
                  onClick={(e) => {
                    e.stopPropagation();
                    openVideo(file);
                  }}
                >
                  <span className="text-white text-xs">▶</span>
                </div>
              ) : (
                <img
                  src={file?.startsWith('http') ? file : base_url + file}
                  alt={r.carousel_title}
                  className="w-10 h-10 object-cover rounded-md"
                />
              );
            },
          },
          { key: "carousel_title", label: "Title" },
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
          const res = await getCarouselById(row.carousel_id);
          const s = res?.data;

          const renderFile = (file: string) => {
            if (!file) return "—";
            const isVideo = isVideoFile(file);
            return (
              <div
                className="flex justify-end cursor-pointer group relative"
                onClick={() => isVideo ? openVideo(file) : window.open(base_url + file, "_blank")}
              >
                {isVideo ? (
                  <div className="relative w-20 h-14 bg-gray-900 rounded overflow-hidden flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                    <span className="text-white text-xl">▶</span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs bg-black/60 px-2 py-1 rounded">Play</span>
                    </div>
                  </div>
                ) : (
                  <img
                    src={file?.startsWith('http') ? file : base_url + file}
                    alt="Preview"
                    className="w-20 h-14 object-cover rounded hover:opacity-80 transition-opacity"
                  />
                )}
              </div>
            );
          };

          const formatted = {
            "Carousel Title": s.carousel_title || "—",
            "Carousel Title 02": (
              <span style={{ color: s.carousel_title_02_color }}>
                {s.carousel_title_02 || "—"}
              </span>
            ),
            Subheader: s.carousel_subheader || "—",
            "Flip Text": s.flip_text || "—",
            Description: (
              <p className="text-gray-700 whitespace-pre-line">
                {s.description || "—"}
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
            "Desktop Background": renderFile(s.desktop_background),
            "Mobile Background": renderFile(s.mobile_background),
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
        title={selected ? "Edit Carousel" : "Create Carousel"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={[
          {
            name: "carousel_title",
            label: "Carousel Title",
            type: "text",
          },
          {
            name: "carousel_title_02",
            label: "Carousel Title 02",
            type: "text",
          },
          {
            name: "carousel_title_02_color",
            label: "Carousel Title 02 Color",
            type: "color",
          },
          {
            name: "carousel_subheader",
            label: "Carousel Subheader",
            type: "text",
          },
          {
            name: "flip_text",
            label: "Flip Text (Comma Separated)",
            type: "text",
          },
          {
            name: "description",
            label: "Description",
            type: "textarea",
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
          {
            name: "desktop_background",
            label: "Desktop Background",
            type: "file",
          },
          {
            name: "mobile_background",
            label: "Mobile Background",
            type: "file",
          },
        ]}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateCarousel(selected.carousel_id, fd);
          else await createCarousel(fd);
        }}
        onSuccess={loadData}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Delete Carousel"
        message={`Are you sure you want to delete "${selected?.carousel_title}"?`}
        onConfirm={async () => {
          if (selected) {
            await deleteCarousel(selected.carousel_id);
            setOpenDelete(false);
            loadData();
          }
        }}
      />

      {/* View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Carousel"
        data={viewData}
      />
    </div>
  );
}
