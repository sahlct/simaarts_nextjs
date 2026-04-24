import { apiRequest } from "./apiClients";

export const getGallery = async (
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

  return apiRequest(`/api/gallery?${params.toString()}`, "GET");
};

export const getGalleryById = async (id: number | string) => {
  return apiRequest(`/api/gallery/${id}`, "GET");
};

export const createGallery = async (formData: FormData) => {
  return apiRequest(`/api/gallery`, "POST", formData, true);
};

export const updateGallery = async (id: number, formData: FormData) => {
  return apiRequest(`/api/gallery/${id}`, "PUT", formData, true);
};

export const deleteGallery = async (id: number) => {
  return apiRequest(`/api/gallery/${id}`, "DELETE");
};
