import { useContext, useEffect, useRef } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Route, Routes, useLocation } from "react-router";
import { ClipsContext } from "./contexts/clipsContext";
import { LoadingContext } from "./contexts/loadingContext";
import { useClipboardListener } from "./hooks/useClipboardListener";
import { useGlobalShortcuts, useWindowResize } from "./hooks/useWindow";
import App from "./App";
import Dash from "./routes/Dash";
import Login from "./routes/Login";
import SignUp from "./routes/SignUp";

function Layout() {
  const main = useRef(null);
  const location = useLocation();

  const loadingContext = useContext(LoadingContext);
  const clipsContext = useContext(ClipsContext);

  useGlobalShortcuts(loadingContext, clipsContext);
  useClipboardListener();
  useWindowResize(location, loadingContext);

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
