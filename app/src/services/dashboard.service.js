import { API_ENDPOINTS, PAGINATION } from "../constants.js";
import { apiCall } from "./api.js";

export async function getClips(limit = PAGINATION.LIMIT, page = PAGINATION.INITIAL_PAGE, sortBy = "date", sortOrder = "desc", filterType = "all") {
  const params = new URLSearchParams({
    limit,
    page,
    sortBy,
    sortOrder,
    filterType,
  });
  return apiCall(`${API_ENDPOINTS.DASHBOARD.GET}?${params.toString()}`, {
    method: "GET",
  });
}

export async function searchClips(query, sortBy = "date", sortOrder = "desc", filterType = "all") {
  const params = new URLSearchParams({
    query,
    sortBy,
    sortOrder,
    filterType,
  });
  return apiCall(`${API_ENDPOINTS.DASHBOARD.SEARCH}?${params.toString()}`, {
    method: "GET",
  });
}
