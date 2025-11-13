import App from "./App";
import SignUp from "./routes/SignUp";
import Login from "./routes/Login";
import Dash from "./routes/Dash";

import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";

import { BrowserRouter, Routes, Route } from "react-router";

import { onClipboardUpdate, onTextUpdate, startListening, onImageUpdate } from "tauri-plugin-clipboard-api";

function Layout() {
  useEffect(() => {
    async function setupAppFunctions() {
      await getCurrentWindow().setSimpleFullscreen(true);

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

      await onTextUpdate((text) => {
        console.log("Copied text:", text);
      });

      await onImageUpdate((image) => {
        console.log("Base64 Image:", image);
      });
    })();

    return () => {
      if (stopListening) stopListening();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dash" element={<Dash />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Layout;
