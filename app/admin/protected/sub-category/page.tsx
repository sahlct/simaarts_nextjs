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
  getSubCategories,
  getSubCategoryById,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "@/lib/api/subCategory";

import { getCategories } from "@/lib/api/category";

export default function SubCategoryPage() {
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

  const [categories, setCategories] = useState<any[]>([]);

  const debouncedSearch = useDebounce(search, 500);
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  /** Load Categories */
  const loadCategories = async () => {
    const res = await getCategories(1, 100, "", 1);
    setCategories(res.data || []);
  };

  /** Load Sub Categories */
  const loadData = async () => {
    try {
      const categoryId = filters.category_id
        ? Number(filters.category_id)
        : undefined;

      const status =
        filters.status && filters.status !== ""
          ? Number(filters.status)
          : undefined;

      const res = await getSubCategories(
        page,
        10,
        debouncedSearch,
        status,
        categoryId
      );

      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading sub categories:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, filters]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-[#036ec6]">Sub Categories</h1>

        <div className="flex items-center gap-3">
          <TableFilter
            fields={[
              {
                key: "category_id",
                label: "Category",
                options: categories.map((c) => ({
                  label: c.category_name,
                  value: String(c.category_id),
                })),
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
            Create Sub Category <IconPlus size={20} />
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          {
            key: "sub_category_image",
            label: "Image",
            render: (r) =>
              r.sub_category_image ? (
                <img
                  src={r.sub_category_image?.startsWith('http') ? r.sub_category_image : base_url + r.sub_category_image}
                  className="w-10 h-10 object-cover rounded-full"
                />
              ) : (
                "—"
              ),
          },
          { key: "sub_category_name", label: "Sub Category" },
          {
            key: "order",
            label: "Order No",
            render: (r) => r.order !== null && r.order !== undefined ? r.order : "—",
          },
          {
            key: "category",
            label: "Category",
            render: (r) => r.ProductCategory?.category_name || "—",
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
          const res = await getSubCategoryById(row.sub_category_id);
          const sc = res?.data;

          const formatted = {
            "Sub Category": sc.sub_category_name,
            Category: sc.ProductCategory?.category_name || "—",
            "Sub Category Image": sc.sub_category_image ? (
              <img
                src={sc.sub_category_image?.startsWith('http') ? sc.sub_category_image : base_url + sc.sub_category_image}
                className="w-20 h-20 object-cover rounded"
              />
            ) : (
              "—"
            ),
            Status:
              sc.status == 1 ? (
                <span className="bg-green-100 px-2 py-1 rounded text-xs">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 px-2 py-1 rounded text-xs">
                  Inactive
                </span>
              ),
            "Created At": new Date(sc.created_at).toLocaleString("en-IN"),
            "Updated At": new Date(sc.updated_at).toLocaleString("en-IN"),
          };

          setViewData(formatted);
          setOpenView(true);
        }}
      />

      <DynamicFormModal
        title={selected ? "Edit Sub Category" : "Create Sub Category"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={[
          {
            name: "sub_category_name",
            label: "Sub Category Name",
            type: "text",
            required: true,
          },
          {
            name: "category_id",
            label: "Select Category",
            type: "select",
            options: categories.map((c) => ({
              label: c.category_name,
              value: String(c.category_id),
            })),
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
          {
            name: "order",
            label: "Order No",
            type: "number",
            required: false,
          },
          {
            name: "sub_category_image",
            label: "Image",
            type: "file",
            required: false,
          },
        ]}
        defaultValues={selected}
        onSubmit={async (fd) => {
          if (selected)
            await updateSubCategory(selected.sub_category_id, fd);
          else await createSubCategory(fd);
        }}
        onSuccess={loadData}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteSubCategory(selected.sub_category_id);
            setOpenDelete(false);
            loadData();
          }
        }}
        title="Delete Sub Category"
        message={`Are you sure you want to delete "${selected?.sub_category_name}"?`}
      />

      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Sub Category"
        data={viewData}
      />
    </div>
  );
}
