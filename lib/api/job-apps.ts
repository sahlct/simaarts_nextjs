import { apiRequest } from "@/lib/api/apiClients";

export const getJobApplications = async (
  page = 1,
  limit = 10,
  search = "",
  status?: number,
  application_status?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));
  if (application_status !== undefined)
    params.append("application_status", String(application_status));

  return apiRequest(`/api/job-applications?${params.toString()}`, "GET");
};

export const getJobApplicationById = (id: number) =>
  apiRequest(`/api/job-applications/${id}`, "GET");

export const createJobApplication = (data: FormData) =>
  apiRequest("/api/job-applications", "POST", data, true);

export const updateJobApplication = (id: number, data: FormData) =>
  apiRequest(`/api/job-applications/${id}`, "PUT", data, true);

export const deleteJobApplication = (id: number) =>
  apiRequest(`/api/job-applications/${id}`, "DELETE", undefined, true);
