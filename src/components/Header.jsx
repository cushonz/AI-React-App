import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-zinc-900 p-4 flex justify-between items-center">
      <Link to="/" className="text-white text-2xl font-bold">
        Spotify AI
      </Link>
    </header>
  );
}

export default Header;
