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
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api/category";

export default function CategoryPage() {
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

      const res = await getCategories(page, 10, debouncedSearch, status);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, filters]);

  return (
    <div className="p-4 sm:p-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-[#036ec6]">
          Product Categories
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
            className="bg-gradient-to-r from-[#036ec67c] to-[#036ec6] border border-gray-300 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Create Category <IconPlus size={20} />
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
            key: "category_image",
            label: "Image",
            render: (r) =>
              r.category_image ? (
                <img
                  src={r.category_image?.startsWith('http') ? r.category_image : base_url + r.category_image}
                  className="w-10 h-10 rounded object-cover"
                />
              ) : (
                "—"
              ),
          },
          { key: "category_name", label: "Category Name" },
          {
            key: "order",
            label: "Order No",
            render: (r) => r.order !== null && r.order !== undefined ? r.order : "—",
          },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status == 1 ? (
                <span className="bg-green-100 px-3 py-0.5 rounded-full">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 px-3 py-0.5 rounded-full">
                  Inactive
                </span>
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
            order: row.order !== null && row.order !== undefined ? String(row.order) : "",
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={async (row) => {
          const res = await getCategoryById(row.category_id);
          const c = res?.data;
          if (!c) return;

          const formatted = {
            "Category Name": c.category_name,
            Description: c.description || "—",
            Status:
              c.status == 1 ? (
                <span className="bg-green-100 px-3 py-1 rounded-full text-xs">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 px-3 py-1 rounded-full text-xs">
                  Inactive
                </span>
              ),
            "Category Image": c.category_image ? (
              <div className="flex justify-end">
                <img
                  src={c.category_image?.startsWith('http') ? c.category_image : base_url + c.category_image}
                  className="w-14 h-14 rounded object-cover"
                />
              </div>
            ) : (
              "—"
            ),
            "Created At": new Date(c.created_at).toLocaleString("en-IN"),
            "Updated At": new Date(c.updated_at).toLocaleString("en-IN"),
          };

          setViewData(formatted);
          setOpenView(true);
        }}
      />

      {/* FORM MODAL */}
      <DynamicFormModal
        title={selected ? "Edit Category" : "Create Category"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={[
          {
            name: "category_name",
            label: "Category Name",
            type: "text",
            required: true,
          },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            required: false,
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
            name: "order",
            label: "Order No",
            type: "number",
            required: false,
          },
          {
            name: "category_image",
            label: "Category Image",
            type: "file",
            required: false,
          },
        ]}
        defaultValues={selected}
        onSubmit={async (fd) => {
          if (selected) await updateCategory(selected.category_id, fd);
          else await createCategory(fd);
        }}
        onSuccess={loadData}
      />

      {/* DELETE CONFIRM MODAL */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteCategory(selected.category_id);
            setOpenDelete(false);
            loadData();
          }
        }}
        title="Delete Category"
        message={`Are you sure you want to delete "${selected?.category_name}"?`}
      />

      {/* VIEW MODAL */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Category"
        data={viewData}
      />
    </div>
  );
}
