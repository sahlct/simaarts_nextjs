import { apiRequest } from "@/lib/api/apiClients";

export const getJobs = async (
  page = 1,
  limit = 10,
  search = "",
  status?: number,
  type?: string,
  location?: string
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));
  if (type) params.append("type", type);
  if (location) params.append("location", location);

  return apiRequest(`/api/jobs?${params.toString()}`, "GET");
};

export const getJobById = (id: number) =>
  apiRequest(`/api/jobs/${id}`, "GET");

export const createJob = (data: FormData) =>
  apiRequest("/api/jobs", "POST", data, true);

export const updateJob = (id: number, data: FormData) =>
  apiRequest(`/api/jobs/${id}`, "PUT", data, true);

export const deleteJob = (id: number) =>
  apiRequest(`/api/jobs/${id}`, "DELETE", undefined, true);
