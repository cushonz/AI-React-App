import Header from "../components/Header.jsx";
import SearchCard from "../components/SearchCard.jsx";

function Search() {
  return (
    <div className="bg-zinc-950 min-h-screen min-w-screen">
      <Header />
      <div className="flex items-center p-4">
        <input
          type="text"
          placeholder="Search for songs..."
          className="bg-zinc-800 text-white placeholder:text-zinc-500 border border-zinc-700 focus:outline-none focus:border-green-500 rounded-md"
        />
        <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md ml-2">
          Search
        </button>
      </div>
      <SearchCard
        name="Creep"
        artist="Radiohead"
        Album="Pablo Honey"
        albumArt="https://placehold.co/100x100?text=Art"
      />
    </div>
  );
}

export default Search;
