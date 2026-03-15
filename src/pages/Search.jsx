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

  function handleSelect(index) {
    setSelected(index);
  }

  function nextPage() {
    if (page < SearchResults.length / 10 - 1) {
      setPage(page + 1);
    }
  }

  function prevPage() {
    if (page > 0) {
      setPage(page - 1);
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

  return (
    <div className="flex flex-col bg-zinc-950 min-h-screen min-w-screen">
      <Header />
      <div className="flex items-center p-4 max-w-2xl md:max-w-4xl mx-auto w-full">
        <input
          type="text"
          placeholder="Search for songs..."
          className="w-full bg-zinc-800 text-white py-2 px-4 placeholder:text-zinc-500 border border-zinc-700 focus:outline-none focus:border-green-500 rounded-md"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md ml-2"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {isSearching && (
        <div className="flex justify-center items-center flex-1">
          <div className="w-16 h-16 rounded-full border-8 border-zinc-600 border-t-green-500 animate-spin" />
        </div>
      )}
      <div className="max-w-2xl md:max-w-4xl mx-auto w-full px-4 flex flex-col gap-2">
        {SearchResults.slice(page * 10, (page + 1) * 10).map(
          (result, index) => (
            <SearchCard
              key={index}
              name={result.name}
              artist={result.artist}
              albumArt={result.albumArt}
              selected={selected === index}
              onSelect={() => handleSelect(index)}
              downloading={downloading && selected === index}
            />
          ),
        )}
        {SearchResults.length > 0 && (
          <div className="flex justify-between p-4">
            <div>
              <button
                className="bg-white rounded-lg p-6 cursor-pointer"
                onClick={prevPage}
              >
                Previous
              </button>
            </div>
            <div>
              <button
                className="bg-white rounded-lg p-6 cursor-pointer"
                onClick={nextPage}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {selected !== null && (
        <div className="max-w-2xl md:max-w-4xl mx-auto w-full px-4 py-4">
          <button
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-full transition duration-200"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
}

export default Search;
