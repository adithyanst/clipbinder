import { useContext, useEffect, useRef, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useNavigate } from "react-router-dom";
import { LoadingContext } from "../contexts/loadingContext";
import { ClipsContext } from "../contexts/clipsContext";
import { writeText } from "tauri-plugin-clipboard-api";

function Dash() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const noMoreRef = useRef(false);

  const loadingContext = useContext(LoadingContext);
  const clipsContext = useContext(ClipsContext);

  const listRef = useRef(null);
  const itemsRef = useRef([]);

  function handleLogout() {
    localStorage.removeItem("jwt");
    navigate("/");
  }

  // initial load
  useEffect(() => {
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
  }, []);

  // load on page change
  useEffect(() => {
    const token = localStorage.getItem("jwt");

    fetch(`${import.meta.env.VITE_BACKEND_URL}/dashboard/get?limit=10&page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((jsonRes) => {
        if (page === 0) {
          clipsContext.setClips(jsonRes);
          console.log(clipsContext.clips);
          setSelectedIndex(jsonRes.length > 0 ? 0 : -1);
        } else {
          clipsContext.setClips((prev) => [...prev, ...jsonRes]);
        }
        setLoadingMore(false);
      })
      .catch(() => {
        setLoadingMore(false);
      });
  }, [page]);

  // keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (clipsContext.clips.length === 0) return;
      if (e.metaKey && e.key === "j") {
        setSelectedIndex((prev) => {
          const next = Math.min(prev + 1, clipsContext.clips.length - 1);
          if (next === clipsContext.clips.length - 2 && !loadingMore && !noMoreRef.current) {
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
  }, [clipsContext.clips, loadingMore, selectedIndex]);

  // scroll left sidebar so selected item is visible
  useEffect(() => {
    if (selectedIndex == null || selectedIndex < 0) return;
    const el = itemsRef.current[selectedIndex];
    if (el) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth", inline: "nearest" });
    } else if (listRef.current) {
      const container = listRef.current;
      const approxTop = selectedIndex * 40; // if item height ~40px; optional fallback
      container.scrollTop = approxTop - container.clientHeight / 2;
    }
  }, [selectedIndex]);

  return loadingContext.loading ? (
    <div className="flex flex-col items-center justify-center px-8 py-5 text-white">loading</div>
  ) : (
    <div className="w-200 overflow-hidden">
      <div className="px-4 py-3">
        <input placeholder="search" />
      </div>
      <div className="flex h-80">
        <div
          ref={listRef}
          className="flex h-full w-[30%] flex-col overflow-y-auto border-[#515151] border-r-[1.5px] border-solid"
        >
          {clipsContext.clips.map((x, i) => (
            <button
              key={x.id}
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
              className={`cursor-pointer border-[#515151] border-b-[1.5px] border-solid p-2 ${i === selectedIndex ? "bg-[#282828]" : ""}`}
              onClick={() => setSelectedIndex(i)}
              type="button"
            >
              <p>{`${x.data.slice(0, 20)}...`}</p>
            </button>
          ))}
        </div>
        <div className="h-full w-[70%] select-none overflow-y-auto p-4" data-tauri-drag-region>
          {selectedIndex >= 0 && clipsContext.clips[selectedIndex] ? (
            <div>
              <p className="mt-2 whitespace-pre-wrap">{clipsContext.clips[selectedIndex].data}</p>
              <p className="mt-4 text-sm">id: {clipsContext.clips[selectedIndex].id}</p>
            </div>
          ) : (
            <div>no clip selected</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dash;
