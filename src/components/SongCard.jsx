function SongCard({
  id,
  name,
  artist,
  onClick,
  albumArt,
  downloadComplete,
  isDownloading,
}) {
  return (
    <div
      className={`flex-col bg-zinc-800 rounded-lg p-4 flex gap-2 transition duration-200 hover:scale-102 cursor-pointer ${isDownloading ? "animate-bounce" : ""} ${downloadComplete ? "border-2 border-green-500" : ""}`}
      onClick={onClick}
    >
      <img src={albumArt || "https://placehold.co/50x50?text=?"}></img>
      <div className={`flex flex-col justify-center items-center w-full`}>
        <div className="flex gap-2 items-center">
          <h2 className="text-white text-lg font-semibold">{name}</h2>
        </div>
        <h2 className="text-white text-lg font-semibold">{artist}</h2>
      </div>
    </div>
  );
}

export default SongCard;
