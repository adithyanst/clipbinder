import { useEffect } from "react";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";
import { PAGINATION, SHORTCUT_KEYS } from "../constants.js";
import { getClips } from "../services/dashboard.service.js";

export function useGlobalShortcuts(loadingContext, clipsContext) {
  useEffect(() => {
    async function setupAppFunctions() {
      await unregisterAll();
      await register(SHORTCUT_KEYS.TOGGLE_WINDOW, async (e) => {
        if (e.state === "Released") return;

        console.log("Shortcut triggered");

        const focused = await getCurrentWindow().isFocused();

        if (focused) {
          getCurrentWindow().hide();
          console.log("window hidden");
        } else {
          loadingContext.setLoading(true);

          try {
            const data = await getClips(PAGINATION.LIMIT, 0);
            clipsContext.setClips(data);
          } catch (err) {
            console.error("Failed to fetch clips:", err);
            loadingContext.setLoading(false);
          }

          getCurrentWindow()
            .show()
            .then(() => {
              getCurrentWindow().setFocus();
            });
          console.log("data refetched, window shown and focused");
          loadingContext.setLoading(false);
        }
      });
    }

    setupAppFunctions();

    return () => {
      unregisterAll();
    };
  }, [loadingContext, clipsContext]);
}

export function useWindowResize(location, loadingContext) {
  useEffect(() => {
    const mainElement = document.querySelector("main");
    requestAnimationFrame(() => {
      console.log(`location changed to ${location.pathname}; refreshing resize`);
      console.log(`loading changed to ${loadingContext.loading}; refreshing resize`);
      if (mainElement) {
        const width = mainElement.offsetWidth;
        const height = mainElement.offsetHeight;

        getCurrentWindow().setSize(new LogicalSize(width + 10, height + 10));
        console.log("Resized to", width, height);
      }
    });
  }, [location, loadingContext.loading]);
}
