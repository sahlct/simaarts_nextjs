import { apiRequest } from "@/lib/api/apiClients";

// LIST PRODUCTS
export const getProducts = async (
  page = 1,
  limit = 10,
  search = "",
  options?: {
    category_id?: number;
    sub_category_id?: number;
    is_new?: number;
    is_best_selling?: number;
    is_stock?: number;
    status?: number;
  }
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);

  if (options?.category_id !== undefined)
    params.append("category_id", String(options.category_id));
  if (options?.sub_category_id !== undefined)
    params.append("sub_category_id", String(options.sub_category_id));
  if (options?.is_new !== undefined)
    params.append("is_new", String(options.is_new));
  if (options?.is_best_selling !== undefined)
    params.append("is_best_selling", String(options.is_best_selling));
  if (options?.is_stock !== undefined)
    params.append("is_stock", String(options.is_stock));
  if (options?.status !== undefined)
    params.append("status", String(options.status));

  return apiRequest(`/api/product?${params.toString()}`, "GET");
};

// LIST PUBLIC PRODUCTS (Category/SubCategory sorted)
export const getPublicProducts = async (
  page = 1,
  limit = 20,
  search = "",
  options?: {
    category_id?: number;
    sub_category_id?: number;
    is_new?: number;
    is_best_selling?: number;
    is_stock?: number;
    status?: number;
  }
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);

  if (options?.category_id !== undefined)
    params.append("category_id", String(options.category_id));
  if (options?.sub_category_id !== undefined)
    params.append("sub_category_id", String(options.sub_category_id));
  if (options?.is_new !== undefined)
    params.append("is_new", String(options.is_new));
  if (options?.is_best_selling !== undefined)
    params.append("is_best_selling", String(options.is_best_selling));
  if (options?.is_stock !== undefined)
    params.append("is_stock", String(options.is_stock));
  if (options?.status !== undefined)
    params.append("status", String(options.status));

  return apiRequest(`/api/product/public-list?${params.toString()}`, "GET");
};

// SINGLE PRODUCT
export const getProductById = (id: number) =>
  apiRequest(`/api/product/${id}`, "GET");

// SINGLE PRODUCT BY SLUG
export const getProductBySlug = (
  slug: string,
  category_id?: string | number | null,
  sub_category_id?: string | number | null
) => {
  const params = new URLSearchParams();
  if (category_id) params.append("category_id", String(category_id));
  if (sub_category_id) params.append("sub_category_id", String(sub_category_id));
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/api/product/slug/${slug}${query}`, "GET");
};

// CREATE
export const createProduct = (data: FormData) =>
  apiRequest("/api/product", "POST", data, true);

// UPDATE
export const updateProduct = (id: number, data: FormData) =>
  apiRequest(`/api/product/${id}`, "PUT", data, true);

// DELETE
export const deleteProduct = (id: number) =>
  apiRequest(`/api/product/${id}`, "DELETE", undefined, true);

// SIMILAR PRODUCTS
export const getSimilarProducts = (id: number, limit = 4) =>
  apiRequest(`/api/product/similar/${id}?limit=${limit}`, "GET");
