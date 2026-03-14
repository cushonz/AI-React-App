import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  return (
    <header className="bg-zinc-900 px-6 py-4 flex items-center gap-8 border-b border-zinc-800 shadow-lg">
      <Link
        to="/dashboard"
        className="text-green-500 text-xl font-bold tracking-tight"
      >
        Spotify AI
      </Link>
      <nav className="flex gap-6">
        <Link
          to="/dashboard"
          className={`text-sm font-medium transition-colors duration-200 ${location.pathname === "/dashboard" ? "text-white" : "text-zinc-400 hover:text-white"}`}
        >
          Dashboard
        </Link>
        <Link
          to="/search"
          className={`text-sm font-medium transition-colors duration-200 ${location.pathname === "/search" ? "text-white" : "text-zinc-400 hover:text-white"}`}
        >
          Search
        </Link>
      </nav>
    </header>
  );
}

export default Header;
