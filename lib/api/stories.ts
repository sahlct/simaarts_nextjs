import { apiRequest } from "@/lib/api/apiClients";

export const getCustomerStories = async (
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

  return apiRequest(`/api/customer-stories?${params.toString()}`, "GET");
};

export const getCustomerStoryById = (id: number) =>
  apiRequest(`/api/customer-stories/${id}`, "GET");

export const createCustomerStory = (data: FormData) =>
  apiRequest("/api/customer-stories", "POST", data, true);

export const updateCustomerStory = (id: number, data: FormData) =>
  apiRequest(`/api/customer-stories/${id}`, "PUT", data, true);

export const deleteCustomerStory = (id: number) =>
  apiRequest(`/api/customer-stories/${id}`, "DELETE", undefined, true);
