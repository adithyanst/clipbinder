import { API_ENDPOINTS } from "../constants.js";
import { apiCall } from "./api.js";

export async function addClip(data, type) {
  return apiCall(API_ENDPOINTS.CLIPS.ADD, {
    method: "POST",
    body: JSON.stringify({ data, type }),
  });
}

export async function getUploadImageUrl() {
  return apiCall(API_ENDPOINTS.CLIPS.UPLOAD_IMAGE, {
    method: "GET",
  });
}

export async function uploadImageToS3(presignedUrl, blob) {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    body: blob,
    headers: {
      "Content-Type": "image/png",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("S3 upload failed:", response.status, text);
    throw new Error(`S3 upload failed: ${response.status}`);
  }

  return presignedUrl.split("?")[0];
}

export async function togglePin(clipId) {
  return apiCall(API_ENDPOINTS.CLIPS.TOGGLE_PIN, {
    method: "POST",
    body: JSON.stringify({ clipId }),
  });
}

export async function deleteClipFromBackend(clipId) {
  return apiCall(API_ENDPOINTS.CLIPS.DELETE, {
    method: "POST",
    body: JSON.stringify({ clipId }),
  });
}
