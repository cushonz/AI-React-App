import Header from "../components/Header.jsx";
import SearchCard from "../components/SearchCard.jsx";
import { useState } from "react";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [SearchResults, setSearchResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [page, setPage] = useState(0);

  async function handleSearch() {
    if (!searchTerm.trim()) return;
    try {
      setIsSearching(true);
      setSearchResults([]);
      setPage(0);
      setSelected(null);
      setDownloaded(false);
      const response = await fetch("http://localhost:3001/search-itunes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: searchTerm }),
      });
      const data = await response.json();
      setIsSearching(false);
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error searching iTunes:", error);
      setIsSearching(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  function handleSelect(globalIndex) {
    setSelected(globalIndex);
    setDownloaded(false);
  }

  function nextPage() {
    if (page < Math.ceil(SearchResults.length / 10) - 1) {
      setPage(page + 1);
      setSelected(null);
    }
  }

  function prevPage() {
    if (page > 0) {
      setPage(page - 1);
      setSelected(null);
    }
  }

  function handleDownload() {
    const song = SearchResults[selected];
    setDownloading(true);
    fetch("http://localhost:3001/download-songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songs: [song] }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setDownloaded(true);
        }
        setDownloading(false);
      })
      .catch(() => setDownloading(false));
  }

  const totalPages = Math.ceil(SearchResults.length / 10);
  const hasResults = SearchResults.length > 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950">
      <Header />

      {/* Search bar */}
      <div className="shrink-0 border-b border-zinc-800/60 px-6 py-4">
        <div className="max-w-2xl md:max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={searchTerm}
            placeholder="Artist, song, or album..."
            className="flex-1 bg-zinc-900 text-white py-2.5 px-4 placeholder:text-zinc-600 border border-zinc-800 focus:outline-none focus:border-zinc-600 rounded-lg transition-all duration-200 text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold px-6 py-2.5 rounded-lg transition-all duration-200 text-sm shrink-0"
            onClick={handleSearch}
            disabled={isSearching}
          >
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl md:max-w-4xl mx-auto px-6 py-4 flex flex-col gap-2">
          {/* Loading */}
          {isSearching && (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 rounded-full border-4 border-zinc-800 border-t-green-500 animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!isSearching && !hasResults && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-5 h-5 text-zinc-600"
                >
                  <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-zinc-600 text-sm">
                Search for a song or artist to get started
              </p>
            </div>
          )}

          {/* Results list */}
          {!isSearching && hasResults && (
            <>
              <div className="flex items-center justify-between py-1 mb-1">
                <p className="text-zinc-500 text-xs">
                  {SearchResults.length} results
                </p>
                <p className="text-zinc-600 text-xs">
                  Page {page + 1} of {totalPages}
                </p>
              </div>

              {SearchResults.slice(page * 10, (page + 1) * 10).map(
                (result, index) => {
                  const globalIndex = page * 10 + index;
                  return (
                    <SearchCard
                      key={globalIndex}
                      name={result.name}
                      artist={result.artist}
                      albumArt={result.albumArt}
                      selected={selected === globalIndex}
                      onSelect={() => handleSelect(globalIndex)}
                      downloading={downloading && selected === globalIndex}
                    />
                  );
                },
              )}

              {/* Pagination */}
              <div className="flex justify-between items-center py-4">
                <button
                  onClick={prevPage}
                  disabled={page === 0}
                  className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-800"
                >
                  ← Previous
                </button>
                <button
                  onClick={nextPage}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-800"
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Download bar */}
      <div className="shrink-0 border-t border-zinc-800/60 px-6 py-4">
        <div className="max-w-2xl md:max-w-4xl mx-auto">
          <button
            onClick={handleDownload}
            disabled={selected === null || downloading || downloaded}
            className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-0 disabled:pointer-events-none text-black font-bold py-3 rounded-full transition-all duration-300 text-sm flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                Downloading...
              </>
            ) : downloaded ? (
              "Downloaded ✓"
            ) : (
              "Download"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Search;
