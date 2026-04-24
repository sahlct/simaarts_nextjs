import { apiRequest } from "@/lib/api/apiClients";

export const getCategories = async (
  page = 1,
  limit = 10,
  search = "",
  status?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));

  return apiRequest(`/api/product-category?${params.toString()}`, "GET");
};

export const getCategoryById = (id: number) =>
  apiRequest(`/api/product-category/${id}`, "GET");

export const createCategory = (data: FormData) =>
  apiRequest("/api/product-category", "POST", data, true);

export const updateCategory = (id: number, data: FormData) =>
  apiRequest(`/api/product-category/${id}`, "PUT", data, true);

export const deleteCategory = (id: number) =>
  apiRequest(`/api/product-category/${id}`, "DELETE", undefined, true);
