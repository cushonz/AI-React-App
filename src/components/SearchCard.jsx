function SearchCard({
  name,
  artist,
  albumArt,
  Album,
  selected,
  onSelect,
  downloading,
}) {
  return (
    <div
      className={`
        group relative bg-zinc-800/80 px-4 py-3 rounded-xl
        cursor-pointer overflow-hidden
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:bg-zinc-700/90
        hover:shadow-xl hover:shadow-green-500/20
        ${selected ? "ring-1 ring-green-500 bg-zinc-700/90 shadow-lg shadow-green-500/20" : ""}
        ${downloading ? "animate-bounce" : ""}
      `}
      onClick={onSelect}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex gap-4 items-center">
        <img
          src={albumArt || "https://placehold.co/64x64?text=?"}
          alt={name}
          className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover shadow-md"
        />
        <div className="flex flex-col gap-1">
          <h2 className="text-white text-base md:text-lg font-semibold leading-tight">
            {name}
          </h2>
          <p className="text-zinc-400 text-sm md:text-base">{artist}</p>
          {Album && <p className="text-zinc-500 text-xs">{Album}</p>}
        </div>
      </div>
    </div>
  );
}

export default SearchCard;
