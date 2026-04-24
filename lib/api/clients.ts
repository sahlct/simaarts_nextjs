import { apiRequest } from "./apiClients";

/**
 * Clients / Logos API helpers
 *
 * Notes:
 * - createLogosBulk expects FormData (multiple files with key "logo_image")
 * - updateLogo expects FormData (single file optional, key "logo_image")
 */

export const getLogos = async (
  page = 1,
  limit = 20,
  search = "",
  status?: number,
  logo_type?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));
  if (logo_type !== undefined) params.append("logo_type", String(logo_type));

  return apiRequest(`/api/logos?${params.toString()}`, "GET");
};

export const getLogoById = async (id: number | string) => {
  return apiRequest(`/api/logos/${id}`, "GET");
};

export const createLogosBulk = async (formData: FormData) => {
  // send as form-data
  return apiRequest(`/api/logos/bulk`, "POST", formData, true);
};

export const updateLogo = async (id: number | string, formData: FormData) => {
  return apiRequest(`/api/logos/${id}`, "PUT", formData, true);
};

export const deleteLogo = async (id: number | string) => {
  return apiRequest(`/api/logos/${id}`, "DELETE");
};

export const bulkDeleteLogos = async (ids: number[]) => {
  return apiRequest(`/api/logos/bulk-delete`, "POST", { ids });
};

export const bulkUpdateLogosStatus = async (ids: number[], status: number) => {
  return apiRequest(`/api/logos/bulk-status`, "POST", { ids, status });
};
