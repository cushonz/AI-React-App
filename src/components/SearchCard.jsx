function SearchCard({
  name,
  artist,
  albumArt,
  selected,
  onSelect,
  downloading,
}) {
  return (
    <div
      className={`
        group relative flex items-center gap-4 px-4 py-3 rounded-xl
        cursor-pointer transition-all duration-200
        ${selected
          ? "bg-zinc-700/80 ring-1 ring-green-500/60 shadow-lg shadow-green-500/10"
          : "bg-zinc-900 ring-1 ring-zinc-800 hover:bg-zinc-800/80 hover:ring-zinc-700"
        }
        ${downloading ? "animate-bounce" : ""}
      `}
      onClick={onSelect}
    >
      {/* Shimmer line on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />

      {/* Album art */}
      <img
        src={albumArt || "https://placehold.co/56x56/27272a/52525b?text=♪"}
        alt={name}
        className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover shadow-md shrink-0"
      />

      {/* Track info */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <p className="text-white text-sm md:text-base font-semibold truncate leading-tight">{name}</p>
        <p className="text-zinc-400 text-xs md:text-sm truncate">{artist}</p>
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 text-black">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default SearchCard;
