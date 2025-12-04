import { API_ENDPOINTS, PAGINATION } from "../constants.js";
import { apiCall } from "./api.js";

export async function getClips(limit = PAGINATION.LIMIT, page = PAGINATION.INITIAL_PAGE) {
  return apiCall(`${API_ENDPOINTS.DASHBOARD.GET}?limit=${limit}&page=${page}`, {
    method: "GET",
  });
}
