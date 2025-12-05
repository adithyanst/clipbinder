import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingContext } from "../contexts/loadingContext";
import { ClipsContext } from "../contexts/clipsContext";
import { useKeyboardNavigation, useScrollToSelected } from "../hooks/useKeyboardNavigation";
import { getClips, searchClips } from "../services/dashboard.service.js";
import { logout } from "../services/auth.service.js";
import { PAGINATION, SORT_OPTIONS, SORT_ORDER_OPTIONS, FILTER_OPTIONS } from "../constants.js";

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
  const searchTimeoutRef = useRef(null);
  const noMoreRef = useRef(false);

  const loadingContext = useContext(LoadingContext);
  const clipsContext = useContext(ClipsContext);

  const listRef = useRef(null);
  const itemsRef = useRef([]);
  const searchInputRef = useRef(null);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleCopyClip() {
    setSearchQuery("");
  }

  // initial load
  useEffect(() => {
    loadingContext.setLoading(true);
    setError("");

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

  useKeyboardNavigation(selectedIndex, setSelectedIndex, clipsContext, loadingMore, setLoadingMore, setPage, displayedClips, setSearchQuery, handleCopyClip);
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
      <div className="px-4 py-3 space-y-2">
        <div className="flex gap-2 items-center">
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
            className="px-2 py-1 bg-[#1B1B1B] border border-[#515151] rounded text-white text-sm cursor-pointer"
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
            className="px-2 py-1 bg-[#1B1B1B] border border-[#515151] rounded text-white text-sm cursor-pointer"
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
            className="px-2 py-1 bg-[#1B1B1B] border border-[#515151] rounded text-white text-sm cursor-pointer"
          >
            {FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {searchQuery && (
          <p className="text-xs opacity-50">
            {isSearching ? "searching..." : `found ${displayedClips.length} clips`}
          </p>
        )}
      </div>
      {error && <div className="px-4 py-2 opacity-50 text-sm">{error}</div>}
      <div className="flex h-80">
        <div
          ref={listRef}
          className="flex h-full w-[30%] flex-col overflow-y-auto border-[#515151] border-r-[1.5px] border-solid"
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
          {loadingMore && <div className="p-2 opacity-50 text-sm text-center">loading more...</div>}
          {displayedClips.length === 0 && !loadingMore && (
            <div className="p-4 opacity-50 text-sm text-center">
              {searchQuery ? "no clips found" : "no clips"}
            </div>
          )}
        </div>
        <div className="h-full w-[70%] select-none overflow-y-auto p-4" data-tauri-drag-region>
          {selectedIndex >= 0 && displayedClips[selectedIndex] ? (
            <div>
              <p className="mt-2 whitespace-pre-wrap">{displayedClips[selectedIndex].data}</p>
              <p className="mt-4 text-sm">id: {displayedClips[selectedIndex].id}</p>
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
