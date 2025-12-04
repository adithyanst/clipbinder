import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { writeText } from "tauri-plugin-clipboard-api";
import { SHORTCUT_KEYS } from "../constants.js";

export function useKeyboardNavigation(selectedIndex, setSelectedIndex, clipsContext, loadingMore, setLoadingMore, setPage) {
  useEffect(() => {
    function onKey(e) {
      if (clipsContext.clips.length === 0) return;

      if (e.metaKey && e.key === "j") {
        setSelectedIndex((prev) => {
          const next = Math.min(prev + 1, clipsContext.clips.length - 1);
          if (next === clipsContext.clips.length - 2 && !loadingMore) {
            setLoadingMore(true);
            setPage((p) => p + 1);
          }
          return next;
        });
      } else if (e.metaKey && e.key === "k") {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.metaKey && e.key === "Enter") {
        writeText(clipsContext.clips[selectedIndex].data);
        getCurrentWindow().hide();
        console.log("window hidden");
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clipsContext.clips, loadingMore, selectedIndex, setSelectedIndex, setLoadingMore, setPage]);
}

export function useScrollToSelected(selectedIndex, itemsRef, listRef) {
  useEffect(() => {
    if (selectedIndex == null || selectedIndex < 0) return;
    const el = itemsRef.current[selectedIndex];
    if (el) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth", inline: "nearest" });
    } else if (listRef.current) {
      const container = listRef.current;
      const approxTop = selectedIndex * 40;
      container.scrollTop = approxTop - container.clientHeight / 2;
    }
  }, [selectedIndex]);
}
