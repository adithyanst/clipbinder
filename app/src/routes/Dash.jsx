import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingContext } from "../contexts/loadingContext";
import { ClipsContext } from "../contexts/clipsContext";
import { useKeyboardNavigation, useScrollToSelected } from "../hooks/useKeyboardNavigation";
import { getClips, searchClips } from "../services/dashboard.service.js";
import { logout } from "../services/auth.service.js";
import { togglePin, deleteClipFromBackend } from "../services/clips.service.js";
import { PAGINATION, SORT_OPTIONS, SORT_ORDER_OPTIONS, FILTER_OPTIONS } from "../constants.js";
import clipbinderLogo from "../assets/clipbinder.svg";

function Dash() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedClips, setDisplayedClips] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterType, setFilterType] = useState("all");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const searchTimeoutRef = useRef(null);
  const logoutTimeoutRef = useRef(null);

  const loadingContext = useContext(LoadingContext);
  const clipsContext = useContext(ClipsContext);

  const listRef = useRef(null);
  const itemsRef = useRef([]);
  const searchInputRef = useRef(null);

  function handleLogout() {
    logout();
    navigate("/");
  }

  // <button onClick={handleLogout} className="mt-4 px-4 py-2 text-white" type="button">
  //   Logout
  // </button>

  function handleCopyClip() {
    setSearchQuery("");
  }

  async function loadMoreClips() {
    if (loadingMore || isSearching || searchQuery.trim()) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newClips = await getClips(PAGINATION.LIMIT, nextPage, sortBy, sortOrder, filterType);
      if (newClips.length > 0) {
        const allClips = [...displayedClips, ...newClips];
        clipsContext.setClips(allClips);
        setDisplayedClips(allClips);
        setPage(nextPage);
      }
    } catch (err) {
      console.error("Failed to load more clips:", err);
    } finally {
      setLoadingMore(false);
    }
  }

  function handleScroll(e) {
    const element = e.target;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 50) {
      loadMoreClips();
    }
  }

  async function handleTogglePin() {
    if (selectedIndex < 0 || !displayedClips[selectedIndex]) return;

    try {
      const clipId = displayedClips[selectedIndex].id;
      const updatedClip = await togglePin(clipId);

      // Update the displayed clips with the new pinned status
      const updatedDisplayedClips = displayedClips.map((clip) =>
        clip.id === clipId ? { ...clip, pinned: updatedClip.pinned } : clip,
      );

      // Re-sort to move pinned clips to top
      const sortedClips = [
        ...updatedDisplayedClips.filter((clip) => clip.pinned),
        ...updatedDisplayedClips.filter((clip) => !clip.pinned),
      ];

      clipsContext.setClips(sortedClips);
      setDisplayedClips(sortedClips);

      // Keep the selection on the same clip
      const newIndex = sortedClips.findIndex((clip) => clip.id === clipId);
      setSelectedIndex(newIndex);
    } catch (err) {
      setError(err.message || "Failed to toggle pin");
      console.error("Pin toggle error:", err);
    }
  }

  async function handleDeleteClip() {
    if (selectedIndex < 0 || !displayedClips[selectedIndex]) return;

    try {
      const clipId = displayedClips[selectedIndex].id;
      await deleteClipFromBackend(clipId);

      // Remove from displayed clips
      const updatedClips = displayedClips.filter((clip) => clip.id !== clipId);
      clipsContext.setClips(updatedClips);
      setDisplayedClips(updatedClips);

      // Update selection
      if (updatedClips.length === 0) {
        setSelectedIndex(-1);
      } else if (selectedIndex >= updatedClips.length) {
        setSelectedIndex(updatedClips.length - 1);
      }
    } catch (err) {
      setError(err.message || "Failed to delete clip");
      console.error("Delete error:", err);
    }
  }

  // initial load
  useEffect(() => {
    loadingContext.setLoading(true);
    setError("");
    setPage(0);

    (async () => {
      try {
        const data = await getClips(PAGINATION.LIMIT, 0, sortBy, sortOrder, filterType);
        clipsContext.setClips(data);
        setDisplayedClips(data);
      } catch (err) {
        setError(err.message || "Failed to load clips");
        console.error("Failed to fetch initial clips:", err);
      } finally {
        loadingContext.setLoading(false);
      }
    })();
  }, [sortBy, sortOrder, filterType]);

  // search effect with debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setDisplayedClips(clipsContext.clips);
      setIsSearching(false);
      setSelectedIndex(0);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setError("");
        const results = await searchClips(searchQuery, sortBy, sortOrder, filterType);
        setDisplayedClips(results);
        setSelectedIndex(results.length > 0 ? 0 : -1);
        setIsSearching(false);
      } catch (err) {
        setError(err.message || "Search failed");
        console.error("Search error:", err);
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, clipsContext.clips, sortBy, sortOrder, filterType]);

  useKeyboardNavigation(
    selectedIndex,
    setSelectedIndex,
    clipsContext,
    loadingMore,
    setLoadingMore,
    setPage,
    displayedClips,
    setSearchQuery,
    handleCopyClip,
  );
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
      <div className="space-y-2 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={searchInputRef}
            placeholder="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="cursor-pointer rounded border border-[#515151] bg-[#1B1B1B] px-2 py-1 text-sm text-white"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="cursor-pointer rounded border border-[#515151] bg-[#1B1B1B] px-2 py-1 text-sm text-white"
          >
            {SORT_ORDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="cursor-pointer rounded border border-[#515151] bg-[#1B1B1B] px-2 py-1 text-sm text-white"
          >
            {FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {showLogoutConfirm ? (
            <button
              onClick={handleLogout}
              className="rounded bg-[#282828] px-3 py-1 text-sm text-white hover:bg-[#333333]"
              type="button"
            >
              logout
            </button>
          ) : (
            <button
              onClick={() => {
                setShowLogoutConfirm(true);
                // Clear any existing timeout
                if (logoutTimeoutRef.current) {
                  clearTimeout(logoutTimeoutRef.current);
                }
                // Set timeout to revert back to logo after 3 seconds
                logoutTimeoutRef.current = setTimeout(() => {
                  setShowLogoutConfirm(false);
                }, 3000);
              }}
              className="cursor-pointer opacity-50 hover:opacity-100"
              title="Click to logout"
              type="button"
            >
              <img src={clipbinderLogo} alt="Clipbinder" className="pl-2" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-xs opacity-50">{isSearching ? "searching..." : `found ${displayedClips.length} clips`}</p>
        )}
      </div>
      {error && <div className="px-4 py-2 text-sm opacity-50">{error}</div>}
      <div className="flex h-80">
        <div
          ref={listRef}
          className="flex h-full w-[30%] flex-col overflow-y-auto border-[#515151] border-r-[1.5px] border-solid"
          onScroll={handleScroll}
        >
          {displayedClips.map((x, i) => (
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
          {loadingMore && <div className="p-2 text-center text-sm opacity-50">loading more...</div>}
          {displayedClips.length === 0 && !loadingMore && (
            <div className="p-4 text-center text-sm opacity-50">{searchQuery ? "no clips found" : "no clips"}</div>
          )}
        </div>
        <div className="h-full w-[70%] select-none overflow-y-auto p-4" data-tauri-drag-region>
          {selectedIndex >= 0 && displayedClips[selectedIndex] ? (
            <div>
              {displayedClips[selectedIndex].type === "image" ? (
                <img src={displayedClips[selectedIndex].data} alt="Clipped screenshot" />
              ) : (
                <p className="whitespace-pre-wrap">{displayedClips[selectedIndex].data}</p>
              )}
              <div className="mt-4 flex gap-3 text-sm">
                <button
                  onClick={handleTogglePin}
                  className="cursor-pointer text-sm text-white underline opacity-50 hover:opacity-100"
                  title={displayedClips[selectedIndex].pinned ? "Unpin clip" : "Pin clip"}
                  type="button"
                >
                  {displayedClips[selectedIndex].pinned ? "unpin" : "pin"}
                </button>
                <button
                  onClick={handleDeleteClip}
                  className="cursor-pointer text-sm text-white underline opacity-50 hover:opacity-100"
                  title="Delete clip"
                  type="button"
                >
                  delete
                </button>
              </div>
              <p className="mt-4 text-sm opacity-50">id: {displayedClips[selectedIndex].id}</p>
              <p className="text-sm opacity-50">type: {displayedClips[selectedIndex].type}</p>
              <p className="text-sm opacity-50">date created: {displayedClips[selectedIndex].createdAt}</p>
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
