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
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/lib/api/events";

export default function EventsPage() {
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

  // Convert tag text → array
  const normalizeTagsFormData = (fd: FormData) => {
    const tagsValue = fd.get("tags");

    if (!tagsValue) {
      fd.set("tags", JSON.stringify([]));
      return;
    }

    const tagsStr = String(tagsValue).trim();

    // If already JSON
    if (tagsStr.startsWith("[")) {
      try {
        const parsed = JSON.parse(tagsStr);
        if (Array.isArray(parsed)) {
          fd.set("tags", JSON.stringify(parsed));
          return;
        }
      } catch {}
    }

    // Convert comma separated
    const arr = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    fd.set("tags", JSON.stringify(arr));
  };

  const loadData = async () => {
    const status =
      filters.status && filters.status !== ""
        ? Number(filters.status)
        : undefined;

    const res = await getEvents(page, 10, debouncedSearch, status);
    setData(res.data || []);
    setTotalPages(res.totalPages || 1);
  };

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, filters]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-[#036ec6]">Events</h1>

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
            className="bg-gradient-to-r from-[#036ec67c] to-[#036ec6] cursor-pointer hover:bg-cyan-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            Create Event <IconPlus size={20} />
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

          {
            key: "event_image",
            label: "Image",
            render: (r) =>
              r.event_image ? (
                <img
                  src={r.event_image?.startsWith('http') ? r.event_image : base_url + r.event_image}
                  className="w-10 h-10 object-cover rounded-full"
                />
              ) : (
                "—"
              ),
          },

          { key: "event_title", label: "Title" },

          {
            key: "event_date",
            label: "Date",
            render: (r) =>
              r.event_date
                ? new Date(r.event_date).toLocaleDateString("en-IN")
                : "—",
          },

          {
            key: "tags",
            label: "Tags",
            render: (r) => {
              try {
                const arr =
                  typeof r.tags === "string" ? JSON.parse(r.tags) : r.tags;
                return Array.isArray(arr) ? arr.join(", ") : "—";
              } catch {
                return "—";
              }
            },
          },

          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status == 1 ? (
                <div className="bg-green-100 px-3 py-1 w-fit rounded-full text-sm">
                  Active
                </div>
              ) : (
                <div className="bg-red-100 px-3 py-1 w-fit rounded-full text-sm">
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
          let tagsValue = "";
          try {
            const parsed =
              typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags;
            tagsValue = Array.isArray(parsed) ? parsed.join(", ") : "";
          } catch {
            tagsValue = "";
          }

          setSelected({
            ...row,
            event_date: row.event_date.split("T")[0],
            tags: tagsValue,
            status: String(row.status),
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={async (row) => {
          const res = await getEventById(row.event_id);
          const e = res?.data;

          let parsedTags = "—";
          try {
            const arr = JSON.parse(e.tags);
            parsedTags = Array.isArray(arr) ? arr.join(", ") : "—";
          } catch {}

          const details = {
            "Event Title": e.event_title,
            Description: (
              <p className="whitespace-pre-line">{e.event_description}</p>
            ),
            "Event Date": new Date(e.event_date).toLocaleDateString("en-IN"),
            Tags: parsedTags,
            Status:
              e.status == 1 ? (
                <span className="bg-green-100 px-3 py-1 rounded-full text-xs">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 px-3 py-1 rounded-full text-xs">
                  Inactive
                </span>
              ),
            Image: e.event_image ? (
              <img
                src={e.event_image?.startsWith('http') ? e.event_image : base_url + e.event_image}
                className="w-20 h-20 rounded object-cover"
              />
            ) : (
              "—"
            ),
          };

          setViewData(details);
          setOpenView(true);
        }}
      />

      {/* FORM MODAL */}
      <DynamicFormModal
        title={selected ? "Edit Event" : "Create Event"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={[
          {
            name: "event_title",
            label: "Event Title",
            type: "text",
            required: true,
          },
          {
            name: "event_description",
            label: "Description",
            type: "textarea",
            required: true,
          },
          {
            name: "event_date",
            label: "Event Date",
            type: "date",
            required: true,
          },
          { name: "tags", label: "Tags (comma separated)", type: "text" },
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
          { name: "event_image", label: "Event Image", type: "file" },
        ]}
        defaultValues={selected}
        onSubmit={async (fd) => {
          normalizeTagsFormData(fd);

          if (selected) await updateEvent(selected.event_id, fd);
          else await createEvent(fd);
        }}
        onSuccess={loadData}
      />

      {/* DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          await deleteEvent(selected.event_id);
          setOpenDelete(false);
          loadData();
        }}
        title="Delete Event"
        message={`Are you sure you want to delete "${selected?.event_title}"?`}
      />

      {/* VIEW MODAL */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Event"
        data={viewData}
      />
    </div>
  );
}
