import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  return (
    <header className="bg-zinc-950 px-8 py-4 flex items-center justify-between border-b border-zinc-800/60">
      <Link
        to="/dashboard"
        className="flex items-center gap-2 group"
      >
        <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50 transition-shadow duration-300">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-black">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.622.622 0 11-.277-1.215c3.809-.87 7.077-.496 9.712 1.115a.623.623 0 01.207.857zm1.223-2.722a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.519.781.781 0 01.52-.972c3.633-1.102 8.147-.568 11.233 1.328a.78.78 0 01.257 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.937.937 0 11-.543-1.794c3.563-1.08 9.487-.871 13.232 1.38a.937.937 0 01-.072 1.571z"/>
          </svg>
        </div>
        <span className="text-white font-semibold text-base tracking-tight">Playlist AI</span>
      </Link>

      <nav className="flex items-center gap-1">
        <Link
          to="/dashboard"
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            location.pathname === "/dashboard"
              ? "bg-zinc-800 text-white"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/search"
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            location.pathname === "/search"
              ? "bg-zinc-800 text-white"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
          }`}
        >
          Search
        </Link>
      </nav>
    </header>
  );
}

export default Header;
