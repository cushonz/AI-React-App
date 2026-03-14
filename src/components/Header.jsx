import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-zinc-900 p-4 flex items-center gap-10">
      <Link to="/dashboard" className="text-white text-2xl font-bold">
        Spotify AI
      </Link>
      <Link to="/search" className="text-white text-2xl hover:text-gray-400">
        Search
      </Link>
    </header>
  );
}

export default Header;
