export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
  },
  CLIPS: {
    ADD: "/clips/add",
    UPLOAD_IMAGE: "/clips/uploadImage",
  },
  DASHBOARD: {
    GET: "/dashboard/get",
    SEARCH: "/dashboard/search",
  },
};

export const STORAGE_KEYS = {
  JWT: "jwt",
};

export const SHORTCUT_KEYS = {
  TOGGLE_WINDOW: "CommandOrControl+Shift+V",
  SELECT_NEXT: "metaKey+j",
  SELECT_PREV: "metaKey+k",
  COPY_CLIP: "metaKey+Enter",
};

export const PAGINATION = {
  LIMIT: 10,
  INITIAL_PAGE: 0,
};

export const DELAY_SCROLL_ITEM_HEIGHT = 40;
