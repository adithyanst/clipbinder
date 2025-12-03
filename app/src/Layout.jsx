import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";
import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router";
import { onClipboardUpdate, onImageUpdate, onTextUpdate, startListening } from "tauri-plugin-clipboard-api";
import App from "./App";
import LoadingContext from "./contexts/loadingContext";
import Dash from "./routes/Dash";
import Login from "./routes/Login";
import SignUp from "./routes/SignUp";

function Layout() {
  const main = useRef(null);
  const location = useLocation();

  const [loading, setLoading] = useState(false);

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
          getCurrentWindow().show();
          getCurrentWindow().setFocus();
          console.log("window shown and focused");
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

      await onImageUpdate((image) => {
        console.log("Base64 Image:", image);
      });
    })();

    return () => {
      if (stopListening) stopListening();
    };
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      console.log(`location changed to ${location.pathname}; refreshing resize`);
      console.log(`loading changed to ${loading}; refreshing resize`);
      if (main.current) {
        const width = main.current.offsetWidth;
        const height = main.current.offsetHeight;

        getCurrentWindow().setSize(new LogicalSize(width + 10, height + 10));
        console.log("Resized to", width, height);
      }
    });
  }, [location, loading]);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
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
    </LoadingContext.Provider>
  );
}

export default Layout;
