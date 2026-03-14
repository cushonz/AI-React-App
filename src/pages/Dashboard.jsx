import { useState } from "react";
import SongCard from "../components/SongCard.jsx";

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
      // show user an error message
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ songs }),
      });

      const data = await response.json();
      if (data.success) {
        // show success message
        console.log(data.message);
        setIsDownloaded(true);
      }
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 items-center justify-center p-4 gap-8">
      <div className="flex flex-col bg-zinc-950 items-center justify-center p-4 gap-8">
        <h1
          className={`text-3xl font-bold text-white ${isThinking ? "animate-bounce" : ""}`}
        >
          Welcome to Spotify AI 🎵
        </h1>
        <div className="w-full max-w-xl flex flex-col gap-4">
          <textarea
            value={vibe}
            className="bg-zinc-800 w-full h-40 resize-none rounded-lg placeholder-zinc-500 text-white p-4 border border-zinc-700 focus:outline-none focus:border-green-500 transition duration-200"
            placeholder="What vibe are we looking for today?"
            onChange={(e) => setVibe(e.target.value)}
          />
          <button
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-full transition duration-200"
            onClick={handleGenerate}
          >
            Generate
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
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
        {songs.length > 0 && (
          <div className="flex w-full p-4 gap-4">
            <button
              className="bg-green-500 hover:bg-green-400 rounded-lg font-bold py-3 w-full"
              onClick={requestDownload}
            >
              Download
            </button>
            <button
              className="bg-red-500 hover:bg-red-400 rounded-lg font-bold py-3 w-full"
              onClick={resetList}
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
