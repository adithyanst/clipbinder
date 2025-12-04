import { BACKEND_URL, STORAGE_KEYS } from "../constants.js";

export function getAuthToken() {
  return localStorage.getItem(STORAGE_KEYS.JWT);
}

export function setAuthToken(token) {
  localStorage.setItem(STORAGE_KEYS.JWT, token);
}

export function clearAuthToken() {
  localStorage.removeItem(STORAGE_KEYS.JWT);
}

export async function apiCall(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = new Error(`API Error: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}
