import { apiRequest } from "@/lib/api/apiClients";

export const getSubCategories = async (
  page = 1,
  limit = 10,
  search = "",
  status?: number,
  category_id?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));
  if (category_id !== undefined) params.append("category_id", String(category_id));

  return apiRequest(`/api/sub-category?${params.toString()}`, "GET");
};

export const getSubCategoryById = (id: number) =>
  apiRequest(`/api/sub-category/${id}`, "GET");

export const createSubCategory = (data: FormData) =>
  apiRequest("/api/sub-category", "POST", data, true);

export const updateSubCategory = (id: number, data: FormData) =>
  apiRequest(`/api/sub-category/${id}`, "PUT", data, true);

export const deleteSubCategory = (id: number) =>
  apiRequest(`/api/sub-category/${id}`, "DELETE", undefined, true);
