import { apiRequest } from "@/lib/api/apiClients";

export const getServices = async (
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

  return apiRequest(`/api/service?${params.toString()}`, "GET");
};

export const getServiceById = (id: number) =>
  apiRequest(`/api/service/${id}`, "GET");

export const createService = (data: FormData) =>
  apiRequest("/api/service", "POST", data, true);

export const updateService = (id: number, data: FormData) =>
  apiRequest(`/api/service/${id}`, "PUT", data, true);

export const deleteService = (id: number) =>
  apiRequest(`/api/service/${id}`, "DELETE", undefined, true);
