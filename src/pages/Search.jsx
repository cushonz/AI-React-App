import Header from "../components/Header.jsx";
import SearchCard from "../components/SearchCard.jsx";
import { useState } from "react";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [SearchResults, setSearchResults] = useState([]);

  async function handleSearch() {
    try {
      const response = await fetch("http://localhost:3001/search-itunes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: searchTerm }),
      });

      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error searching iTunes:", error);
      // show user an error message
    }
  }

  return (
    <div className="bg-zinc-950 min-h-screen min-w-screen">
      <Header />
      <div className="flex items-center p-4">
        <input
          type="text"
          placeholder="Search for songs..."
          className="bg-zinc-800 text-white placeholder:text-zinc-500 border border-zinc-700 focus:outline-none focus:border-green-500 rounded-md"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md ml-2"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {SearchResults.map((result, index) => (
        <SearchCard
          key={index}
          name={result.name}
          artist={result.artist}
          albumArt={result.albumArt}
        />
      ))}
    </div>
  );
}

export default Search;
