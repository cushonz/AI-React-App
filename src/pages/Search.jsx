import Header from "../components/Header.jsx";
import SearchCard from "../components/SearchCard.jsx";
import { useState } from "react";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [SearchResults, setSearchResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [page, setPage] = useState(0);

  async function handleSearch() {
    try {
      setIsSearching(true);
      setSearchResults([]);
      setPage(0);
      const response = await fetch("http://localhost:3001/search-itunes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: searchTerm }),
      });
      setSelected(null);

      const data = await response.json();
      setIsSearching(false);
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error searching iTunes:", error);
      setIsSearching(false);
    }
  }

  function handleSelect(globalIndex) {
    setSelected(globalIndex);
  }

  function nextPage() {
    if (page < SearchResults.length / 10 - 1) {
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
          console.log(data.message);
          setDownloading(false);
        } else {
          console.error("Download failed:", data.message);
          setDownloading(false);
        }
      });
  }

  const totalPages = Math.ceil(SearchResults.length / 10);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950">
      <Header />
      {/* Search bar — fixed height */}
      <div className="flex items-center p-4 max-w-2xl md:max-w-4xl mx-auto w-full shrink-0">
        <input
          type="text"
          placeholder="Search for songs..."
          className="w-full bg-zinc-800 text-white py-2 px-4 placeholder:text-zinc-500 border border-zinc-700 focus:outline-none focus:border-green-500 rounded-md"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md ml-2 shrink-0"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Scrollable results area */}
      <div className="flex-1 overflow-y-auto max-w-2xl md:max-w-4xl mx-auto w-full px-4 flex flex-col gap-2">
        {isSearching && (
          <div className="flex justify-center items-center flex-1 h-full">
            <div className="w-16 h-16 rounded-full border-8 border-zinc-600 border-t-green-500 animate-spin" />
          </div>
        )}
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
        {SearchResults.length > 0 && (
          <div className="flex justify-between items-center px-2 py-4">
            <button
              onClick={prevPage}
              disabled={page === 0}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <span className="text-zinc-500 text-sm">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={page >= totalPages - 1}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Download bar — fixed height, always rendered */}
      <div className="shrink-0 max-w-2xl md:max-w-4xl mx-auto w-full px-4 py-4">
        <button
          onClick={handleDownload}
          disabled={selected === null}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-full transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none"
        >
          Download
        </button>
      </div>
    </div>
  );
}

export default Search;
