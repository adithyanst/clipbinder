import { API_ENDPOINTS } from "../constants.js";
import { apiCall, setAuthToken, clearAuthToken } from "./api.js";

export async function login(email, password) {
  const data = await apiCall(API_ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  setAuthToken(data.jwt);
  return data;
}

export async function signup(name, email, password) {
  const data = await apiCall(API_ENDPOINTS.AUTH.SIGNUP, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  setAuthToken(data.jwt);
  return data;
}

export function logout() {
  clearAuthToken();
}
