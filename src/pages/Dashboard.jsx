import { useState } from "react";
import SongCard from "../components/SongCard.jsx";
import Header from "../components/Header.jsx";

function Dashboard() {
  const [songs, setSongs] = useState([]);
  const [vibe, setVibe] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleGenerate() {
    setIsThinking(true);
    setIsDownloaded(false);
    try {
      const response = await fetch("http://localhost:3001/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe }),
      });
      const data = await response.json();
      setSongs(data.songs);
    } catch (error) {
      console.error("Something went wrong:", error);
    } finally {
      setIsThinking(false);
    }
  }

  function handleRemoveSong(index) {
    setSongs(songs.filter((_, i) => i !== index));
  }

  function resetList() {
    setSongs([]);
    setVibe("");
    setIsDownloaded(false);
    setIsDownloading(false);
  }

  async function requestDownload() {
    try {
      setIsDownloading(true);
      const response = await fetch("http://localhost:3001/download-songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songs }),
      });
      const data = await response.json();
      if (data.success) {
        setIsDownloaded(true);
      }
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  }

  const hasSongs = songs.length > 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950">
      <Header />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">

          {/* Input section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h1 className={`text-white text-xl font-semibold tracking-tight ${isThinking ? "animate-pulse" : ""}`}>
                {isThinking ? "Finding songs..." : "What's the vibe?"}
              </h1>
              {isThinking && (
                <div className="w-5 h-5 rounded-full border-2 border-zinc-700 border-t-green-500 animate-spin" />
              )}
            </div>
            <textarea
              value={vibe}
              className="bg-zinc-900 w-full h-28 resize-none rounded-xl placeholder-zinc-600 text-white p-4 border border-zinc-800 focus:outline-none focus:border-zinc-600 transition-all duration-200 text-sm leading-relaxed"
              placeholder="Describe a mood, energy, or situation — late night drive, Sunday morning coffee, pre-game hype..."
              onChange={(e) => setVibe(e.target.value)}
            />
            <button
              className="self-start bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold px-8 py-2.5 rounded-full transition-all duration-200 text-sm"
              onClick={handleGenerate}
              disabled={isThinking || !vibe.trim()}
            >
              Generate
            </button>
          </div>

          {/* Song grid */}
          {hasSongs && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-zinc-400 text-sm">{songs.length} songs · click to remove</p>
                {isDownloaded && (
                  <span className="text-green-400 text-xs font-medium flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Downloaded
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {songs.map((song, index) => (
                  <SongCard
                    key={index}
                    name={song.name}
                    artist={song.artist}
                    onClick={() => handleRemoveSong(index)}
                    albumArt={song.albumArt}
                    downloadComplete={isDownloaded}
                    isDownloading={isDownloading}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  className="bg-green-500 hover:bg-green-400 disabled:opacity-60 text-black font-bold px-8 py-2.5 rounded-full transition-all duration-200 text-sm flex items-center gap-2"
                  onClick={requestDownload}
                  disabled={isDownloading || isDownloaded}
                >
                  {isDownloading ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                      Downloading...
                    </>
                  ) : isDownloaded ? (
                    "Downloaded ✓"
                  ) : (
                    "Download all"
                  )}
                </button>
                <button
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium px-6 py-2.5 rounded-full transition-all duration-200 text-sm"
                  onClick={resetList}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
