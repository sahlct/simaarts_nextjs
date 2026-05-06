"use client";

import { useEffect, useMemo, useState } from "react";
import { IconPlus } from "@tabler/icons-react";

import TableFilter from "@/components/filter_button";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";

import { useDebounce } from "@/hooks/debounce";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/api/product";

import { getCategories } from "@/lib/api/category";
import { getSubCategories } from "@/lib/api/subCategory";

export default function ProductPage() {
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
  const [allSubCategories, setAllSubCategories] = useState<any[]>([]);
  const [selectedCategoryForForm, setSelectedCategoryForForm] =
    useState<string>("");

  const debouncedSearch = useDebounce(search, 500);
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  // ---- LOAD CATEGORIES + SUBCATEGORIES ----
  const loadCategoryData = async () => {
    const catRes = await getCategories(1, 100, "", 1);
    setCategories(catRes.data || []);

    // all active sub categories
    const subRes = await getSubCategories(1, 1000, "", 1);
    setAllSubCategories(subRes.data || []);
  };

  // ---- FILTERED SUBCATEGORIES FOR FORM ----
  const subCategoriesForForm = useMemo(() => {
    if (!selectedCategoryForForm) return [];
    return allSubCategories.filter(
      (s) => String(s.category_id) === selectedCategoryForForm
    );
  }, [allSubCategories, selectedCategoryForForm]);

  // ---- LOAD PRODUCT LIST ----
  const loadData = async () => {
    const options: any = {};
    if (filters.category_id) options.category_id = Number(filters.category_id);
    if (filters.sub_category_id)
      options.sub_category_id = Number(filters.sub_category_id);
    if (filters.is_new) options.is_new = Number(filters.is_new);
    if (filters.is_best_selling)
      options.is_best_selling = Number(filters.is_best_selling);
    if (filters.is_stock) options.is_stock = Number(filters.is_stock);
    if (filters.status) options.status = Number(filters.status);

    const res = await getProducts(page, 10, debouncedSearch, options);
    setData(res.data || []);
    setTotalPages(res.totalPages || 1);
  };

  useEffect(() => {
    loadCategoryData();
  }, []);

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, filters]);

  // ---- HELPERS ----
  const normalizeFeaturesFormData = (fd: FormData) => {
    const raw = fd.get("features");
    if (raw === null) return;

    const str = String(raw).trim();
    if (!str) {
      fd.set("features", JSON.stringify([]));
      return;
    }

    // if already JSON array
    if (str.startsWith("[")) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) {
          fd.set("features", JSON.stringify(parsed));
          return;
        }
      } catch {
        // fallthrough
      }
    }

    const arr = str
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    fd.set("features", JSON.stringify(arr));
  };

  const categoryOptions = useMemo(
    () =>
      categories.map((c) => ({
        label: c.category_name,
        value: String(c.category_id),
      })),
    [categories]
  );

  const subCategoryOptionsForFilter = useMemo(() => {
    // if category filter selected, narrow down
    if (filters.category_id) {
      return allSubCategories
        .filter((s) => String(s.category_id) === filters.category_id)
        .map((s) => ({
          label: s.sub_category_name,
          value: String(s.sub_category_id),
        }));
    }

    // else all
    return allSubCategories.map((s) => ({
      label: s.sub_category_name,
      value: String(s.sub_category_id),
    }));
  }, [allSubCategories, filters.category_id]);

  // Build the fields for form based on current state
  const buildFormFields = () => {
    return [
      {
        name: "product_name",
        label: "Product Name",
        type: "text",
        required: true,
      },
      {
        name: "category_id",
        label: "Category",
        type: "select",
        options: categoryOptions,
        required: true,
        // we rely on DynamicFormModal calling field.onChange
        onChange: (val: string) => {
          setSelectedCategoryForForm(val);
        },
      },
      {
        name: "sub_category_id",
        label: "Sub Category",
        type: "select",
        options: subCategoriesForForm.map((s) => ({
          label: s.sub_category_name,
          value: String(s.sub_category_id),
        })),
        required: true,
      },
      {
        name: "product_code",
        label: "Product Code",
        type: "text",
        required: false,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: false,
      },
      {
        name: "mrp",
        label: "MRP",
        type: "text",
        required: true,
      },
      {
        name: "price",
        label: "Selling Price",
        type: "text",
        required: true,
      },
      {
        name: "is_new",
        label: "Is New",
        type: "select",
        options: [
          { label: "No", value: "0" },
          { label: "Yes", value: "1" },
        ],
      },
      {
        name: "is_best_selling",
        label: "Best Selling",
        type: "select",
        options: [
          { label: "No", value: "0" },
          { label: "Yes", value: "1" },
        ],
      },
      {
        name: "is_stock",
        label: "In Stock",
        type: "select",
        options: [
          { label: "Out of Stock", value: "0" },
          { label: "In Stock", value: "1" },
        ],
      },
      {
        name: "features",
        label: "Features (comma separated)",
        type: "text",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { label: "Active", value: "1" },
          { label: "Inactive", value: "0" },
        ],
      },
      {
        name: "thumbnail_image",
        label: "Thumbnail Image",
        type: "file",
        multiple: false,
      },
      {
        name: "other_images",
        label: "Other Images",
        type: "file",
        multiple: true,
      },
    ];
  };

  // ---- RENDER ----
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-[#036ec6]">Products</h1>

        <div className="flex items-center gap-3">
          <TableFilter
            fields={[
              {
                key: "category_id",
                label: "Category",
                options: categoryOptions,
              },
              {
                key: "sub_category_id",
                label: "Sub Category",
                options: subCategoryOptionsForFilter,
              },
              {
                key: "is_new",
                label: "Is New",
                options: [
                  { label: "All", value: "" },
                  { label: "Yes", value: "1" },
                  { label: "No", value: "0" },
                ],
              },
              {
                key: "is_best_selling",
                label: "Best Selling",
                options: [
                  { label: "All", value: "" },
                  { label: "Yes", value: "1" },
                  { label: "No", value: "0" },
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
              setSelectedCategoryForForm("");
              setOpenForm(true);
            }}
            className="bg-gradient-to-r from-[#036ec67c] to-[#036ec6] border border-gray-300 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
          >
            Create Product <IconPlus size={20} />
          </button>
        </div>
      </div>

      {/* Table */}
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
                  src={r.thumbnail_image?.startsWith('http') ? r.thumbnail_image : base_url + r.thumbnail_image}
                  className="w-10 h-10 rounded object-cover"
                />
              ) : (
                "—"
              ),
          },
          { key: "product_name", label: "Product" },
          {
            key: "category",
            label: "Category",
            render: (r) => r.ProductCategory?.category_name || "—",
          },
          {
            key: "sub_category",
            label: "Sub Category",
            render: (r) => r.SubCategory?.sub_category_name || "—",
          },
          {
            key: "price",
            label: "Price",
            render: (r) => (r.price != null ? `₹${r.price}` : "—"),
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
          // convert features to comma-separated text
          let featuresText = "";
          try {
            const parsed =
              typeof row.features === "string"
                ? JSON.parse(row.features)
                : row.features;

            if (Array.isArray(parsed)) {
              featuresText = parsed.join(", ");
            }
          } catch {
            featuresText = "";
          }

          setSelected({
            ...row,
            category_id: String(row.category_id),
            sub_category_id: String(row.sub_category_id),
            is_new: String(row.is_new),
            is_best_selling: String(row.is_best_selling),
            is_stock: String(row.is_stock),
            status: String(row.status),
            features: featuresText,
          });

          setSelectedCategoryForForm(String(row.category_id));
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={async (row) => {
          const res = await getProductById(row.product_id);
          const p = res?.data;
          if (!p) return;

          // parse features for display
          let feat = "—";
          try {
            const arr =
              typeof p.features === "string"
                ? JSON.parse(p.features)
                : p.features;
            if (Array.isArray(arr) && arr.length > 0) feat = arr.join(", ");
          } catch {
            feat = "—";
          }

          const details: any = {
            "Product Name": p.product_name || "—",
            "Product Code": p.product_code || "—",
            Category: p.ProductCategory?.category_name || p.category_id || "—",
            "Sub Category":
              p.SubCategory?.sub_category_name || p.sub_category_id || "—",
            Description: (
              <p className="whitespace-pre-line text-gray-700">
                {p.description || "—"}
              </p>
            ),
            MRP: p.mrp != null ? `₹${p.mrp}` : "—",
            Price: p.price != null ? `₹${p.price}` : "—",
            "Is New": p.is_new ? "Yes" : "No",
            "Best Selling": p.is_best_selling ? "Yes" : "No",
            "In Stock": p.is_stock ? "Yes" : "No",
            Features: feat,
            Status: p.status == 1 ? "Active" : "Inactive",
            Thumbnail: p.thumbnail_image ? (
              <img
                src={p.thumbnail_image?.startsWith('http') ? p.thumbnail_image : base_url + p.thumbnail_image}
                className="w-20 h-20 object-cover rounded"
              />
            ) : (
              "—"
            ),
          };

          let otherImgs: string[] = [];

          try {
            otherImgs =
              typeof p.other_images === "string"
                ? JSON.parse(p.other_images) 
                : Array.isArray(p.other_images)
                ? p.other_images
                : [];
          } catch {
            otherImgs = [];
          }

          if (otherImgs.length > 0) {
            details["Other Images"] = (
              <div className="flex gap-2 flex-wrap justify-end">
                {otherImgs.map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img?.startsWith('http') ? img : base_url + img}
                    className="w-16 h-16 object-cover rounded"
                  />
                ))}
              </div>
            );
          }

          setViewData(details);
          setOpenView(true);
        }}
      />

      {/* FORM MODAL */}
      <DynamicFormModal
        title={selected ? "Edit Product" : "Create Product"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={buildFormFields()}
        defaultValues={selected}
        onSubmit={async (fd) => {
          normalizeFeaturesFormData(fd);

          if (selected) await updateProduct(selected.product_id, fd);
          else await createProduct(fd);
        }}
        onSuccess={loadData}
      />

      {/* DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Delete Product"
        message={`Are you sure you want to delete "${selected?.product_name}"?`}
        onConfirm={async () => {
          if (selected) {
            await deleteProduct(selected.product_id);
            setOpenDelete(false);
            loadData();
          }
        }}
      />

      {/* VIEW MODAL */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Product"
        data={viewData}
      />
    </div>
  );
}
