import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";
import { useContext, useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router";
import { onClipboardUpdate, onImageUpdate, onTextUpdate, startListening } from "tauri-plugin-clipboard-api";
import App from "./App";
import { ClipsContext } from "./contexts/clipsContext";
import { LoadingContext } from "./contexts/loadingContext";
import Dash from "./routes/Dash";
import Login from "./routes/Login";
import SignUp from "./routes/SignUp";
import base64ToBlob from "./utils/base64ToBlob";

function Layout() {
  const main = useRef(null);
  const location = useLocation();

  const loadingContext = useContext(LoadingContext);
  const clipsContext = useContext(ClipsContext);

  useEffect(() => {
    async function setupAppFunctions() {
      await unregisterAll();
      await register("CommandOrControl+Shift+V", async (e) => {
        if (e.state === "Released") return;

        console.log("Shortcut triggered");

        const focused = await getCurrentWindow().isFocused();

        if (focused) {
          getCurrentWindow().hide();
          console.log("window hidden");
        } else {
          loadingContext.setLoading(true);

          const token = localStorage.getItem("jwt");

          fetch(`${import.meta.env.VITE_BACKEND_URL}/dashboard/get?limit=10&page=0`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => res.json())
            .then((jsonRes) => {
              clipsContext.setClips(jsonRes);
              loadingContext.setLoading(false);
            })
            .catch(() => {
              loadingContext.setLoading(false);
            });
          getCurrentWindow()
            .show()
            .then(() => {
              getCurrentWindow().setFocus();
            });
          console.log("data refetched, window shown and focused");
        }
      });
    }

    setupAppFunctions();

    return () => {
      unregisterAll();
    };
  }, []);

  // clipboard listener
  useEffect(() => {
    let stopListening;

    console.log("test");

    (async () => {
      stopListening = await startListening();

      await onClipboardUpdate(() => {
        console.log("Clipboard changed!");
      });

      await onTextUpdate(async (text) => {
        console.log("Copied text:", text);

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clips/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify({ data: text, type: "plaintext" }),
        });

        const responseData = await response.json();

        console.log(responseData);
      });

      await onImageUpdate(async (base64) => {
        const blob = base64ToBlob(base64);

        let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clips/uploadImage`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });

        let responseData = await response.json();

        const presignedUrl = responseData.uploadUrl;

        response = await fetch(presignedUrl, {
          method: "PUT",
          body: blob,
          headers: {
            "Content-Type": "image/png",
          },
        });

        if (!response.ok) {
          const text = await response.text();
          console.error("S3 upload failed:", response.status, text);
          return;
        }

        const imageUrl = presignedUrl.split("?")[0];

        console.log(imageUrl);

        response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clips/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify({ data: imageUrl, type: "image" }),
        });

        responseData = await response.json();

        console.log(responseData);
      });
    })();

    return () => {
      if (stopListening) stopListening();
    };
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      console.log(`location changed to ${location.pathname}; refreshing resize`);
      console.log(`loading changed to ${loadingContext.loading}; refreshing resize`);
      if (main.current) {
        const width = main.current.offsetWidth;
        const height = main.current.offsetHeight;

        getCurrentWindow().setSize(new LogicalSize(width + 10, height + 10));
        console.log("Resized to", width, height);
      }
    });
  }, [location, loadingContext.loading]);

  return (
    <main className="flex h-max w-max items-center justify-center">
      <div
        className="flex items-center justify-center overflow-hidden rounded-[12px] border-[#515151] border-[1.5px] border-solid bg-[#1B1B1B] text-white"
        data-tauri-drag-region
        ref={main}
      >
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dash" element={<Dash />} />
        </Routes>
      </div>
    </main>
  );
}

export default Layout;
