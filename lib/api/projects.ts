import { apiRequest } from "@/lib/api/apiClients";

export const getProjects = async (
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

  return apiRequest(`/api/projects?${params.toString()}`, "GET");
};

export const getProjectById = (id: number) =>
  apiRequest(`/api/projects/${id}`, "GET");

export const createProject = (data: FormData) =>
  apiRequest("/api/projects", "POST", data, true);

export const updateProject = (id: number, data: FormData) =>
  apiRequest(`/api/projects/${id}`, "PUT", data, true);

export const deleteProject = (id: number) =>
  apiRequest(`/api/projects/${id}`, "DELETE", undefined, true);
