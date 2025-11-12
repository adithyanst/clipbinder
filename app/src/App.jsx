import { useState, useEffect } from "react";

import { getCurrentWindow } from "@tauri-apps/api/window";
import clipbinderLogo from "./assets/clipbinder.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";

function App() {
  useEffect(() => {
    async function setupAppFunctions() {
      getCurrentWindow().setSimpleFullscreen(true);

      await unregisterAll();
      await register("CommandOrControl+Shift+V", async (e) => {
        if (e.state === "Released") {
          return;
        }
        console.log("Shortcut triggered");

        const focused = await getCurrentWindow().isFocused();

        if (focused) {
          getCurrentWindow().hide();
        } else {
          getCurrentWindow().show();
          getCurrentWindow().setFocus();
        }
      });
    }

    setupAppFunctions();

    return () => {
      unregisterAll();
    };
  }, []);

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div className="flex items-center justify-center rounded-[12px] border-[#515151] border-[1.5px] border-solid bg-[#1B1B1B] px-12 py-6 text-white">
        <div className="flex gap-2">
          <span className="opacity-50">welcome to</span> <img src={clipbinderLogo} alt="logotype for clipbinder" />{" "}
          <span className="opacity-50">would you like to</span> <a href="/login">login</a>{" "}
          <span className="opacity-50">or</span> <a href="/signup">signup</a>
        </div>
      </div>
    </main>
  );
}

export default App;
