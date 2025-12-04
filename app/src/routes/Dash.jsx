import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingContext } from "../contexts/loadingContext";
import { ClipsContext } from "../contexts/clipsContext";
import { useKeyboardNavigation, useScrollToSelected } from "../hooks/useKeyboardNavigation";
import { getClips } from "../services/dashboard.service.js";
import { logout } from "../services/auth.service.js";
import { PAGINATION } from "../constants.js";

function Dash() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const noMoreRef = useRef(false);

  const loadingContext = useContext(LoadingContext);
  const clipsContext = useContext(ClipsContext);

  const listRef = useRef(null);
  const itemsRef = useRef([]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  // initial load
  useEffect(() => {
    loadingContext.setLoading(true);
    setError("");

    (async () => {
      try {
        const data = await getClips(PAGINATION.LIMIT, 0);
        clipsContext.setClips(data);
      } catch (err) {
        setError(err.message || "Failed to load clips");
        console.error("Failed to fetch initial clips:", err);
      } finally {
        loadingContext.setLoading(false);
      }
    })();
  }, []);

  // load on page change
  useEffect(() => {
    (async () => {
      try {
        const data = await getClips(PAGINATION.LIMIT, page);
        if (page === 0) {
          clipsContext.setClips(data);
          setSelectedIndex(data.length > 0 ? 0 : -1);
        } else {
          clipsContext.setClips((prev) => [...prev, ...data]);
        }
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load more clips");
        console.error("Failed to fetch clips:", err);
      } finally {
        setLoadingMore(false);
      }
    })();
  }, [page]);

  useKeyboardNavigation(selectedIndex, setSelectedIndex, clipsContext, loadingMore, setLoadingMore, setPage);
  useScrollToSelected(selectedIndex, itemsRef, listRef);

  if (loadingContext.loading) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-5 text-white">
        <p>loading clips...</p>
        {error && <p className="opacity-50 mt-2 text-sm">{error}</p>}
      </div>
    );
  }

  return (
    <div className="w-200 overflow-hidden">
      <div className="px-4 py-3">
        <input placeholder="search" />
      </div>
      {error && <div className="px-4 py-2 opacity-50 text-sm">{error}</div>}
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
              {x.type === "plaintext" ? <p>{`${x.data.slice(0, 20)}...`}</p> : <img src={x.data} />}
            </button>
          ))}
          {loadingMore && <div className="p-2 opacity-50 text-sm text-center">loading more...</div>}
        </div>
        <div className="h-full w-[70%] select-none overflow-y-auto p-4" data-tauri-drag-region>
          {selectedIndex >= 0 && clipsContext.clips[selectedIndex] ? (
            <div>
              <p className="mt-2 whitespace-pre-wrap">{clipsContext.clips[selectedIndex].data}</p>
              <p className="mt-4 text-sm">id: {clipsContext.clips[selectedIndex].id}</p>
              <button onClick={handleLogout} className="mt-4 px-4 py-2 text-white">
                Logout
              </button>
            </div>
          ) : (
            <div>
              no clip selected
              <button onClick={handleLogout} className="mt-4 px-4 py-2 text-white">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dash;
