import { apiRequest } from "@/lib/api/apiClients";

// LIST EVENTS
export const getEvents = async (
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

  return apiRequest(`/api/events?${params.toString()}`, "GET");
};

// GET SINGLE EVENT
export const getEventById = (id: number) =>
  apiRequest(`/api/events/${id}`, "GET");

// CREATE
export const createEvent = (data: FormData) =>
  apiRequest("/api/events", "POST", data, true);

// UPDATE
export const updateEvent = (id: number, data: FormData) =>
  apiRequest(`/api/events/${id}`, "PUT", data, true);

// DELETE
export const deleteEvent = (id: number) =>
  apiRequest(`/api/events/${id}`, "DELETE", undefined, true);
