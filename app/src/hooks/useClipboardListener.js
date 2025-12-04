import { useEffect } from "react";
import { onClipboardUpdate, onImageUpdate, onTextUpdate, startListening } from "tauri-plugin-clipboard-api";
import base64toBlob from "../helpers/base64ToBlob.js";
import { addClip, getUploadImageUrl, uploadImageToS3 } from "../services/clips.service.js";

export function useClipboardListener() {
  useEffect(() => {
    let stopListening;

    (async () => {
      stopListening = await startListening();

      await onClipboardUpdate(() => {
        console.log("Clipboard changed!");
      });

      await onTextUpdate(async (text) => {
        console.log("Copied text:", text);

        try {
          const response = await addClip(text, "plaintext");
          console.log("Text clip added:", response);
        } catch (err) {
          console.error("Failed to add text clip:", err.message);
        }
      });

      await onImageUpdate(async (base64) => {
        console.log("Copied image");
        const blob = base64toBlob(base64);

        try {
          const { uploadUrl } = await getUploadImageUrl();
          const imageUrl = await uploadImageToS3(uploadUrl, blob);
          const response = await addClip(imageUrl, "image");
          console.log("Image clip added:", response);
        } catch (err) {
          console.error("Failed to add image clip:", err.message);
        }
      });
    })();

    return () => {
      if (stopListening) stopListening();
    };
  }, []);
}
