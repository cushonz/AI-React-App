function SongCard({
  name,
  artist,
  onClick,
  albumArt,
  downloadComplete,
  isDownloading,
}) {
  return (
    <div
      className={`
        group relative flex flex-col bg-zinc-900 rounded-xl overflow-hidden
        cursor-pointer transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40
        ${isDownloading ? "animate-bounce" : ""}
        ${downloadComplete ? "ring-1 ring-green-500" : "ring-1 ring-zinc-800 hover:ring-zinc-700"}
      `}
      onClick={onClick}
    >
      {/* Album art */}
      <div className="relative aspect-square w-full overflow-hidden">
        <img
          src={albumArt || "https://placehold.co/200x200/27272a/52525b?text=♪"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay on hover — indicates clickable/removable */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 px-3 py-1 rounded-full">
            Remove
          </span>
        </div>
        {/* Download complete indicator */}
        {downloadComplete && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-black">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-white text-sm font-semibold truncate leading-tight">{name}</p>
        <p className="text-zinc-400 text-xs mt-0.5 truncate">{artist}</p>
      </div>
    </div>
  );
}

export default SongCard;
