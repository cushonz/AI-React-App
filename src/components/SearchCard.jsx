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
      className={`bg-zinc-800 p-4 m-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 ${selected ? "ring-2 ring-green-500 bg-zinc-700" : ""} ${downloading ? "animate-bounce" : ""}`}
      onClick={onSelect}
    >
      <div className="flex gap-4 items-center">
        <img
          src={albumArt || "https://placehold.co/64x64?text=?"}
          alt={name}
          className="w-16 h-16 rounded-lg object-cover shadow-md"
        />
        <div className="flex flex-col gap-1">
          <h2 className="text-white text-base font-semibold leading-tight">
            {name}
          </h2>
          <p className="text-zinc-400 text-sm">{artist}</p>
          {Album && <p className="text-zinc-500 text-xs">{Album}</p>}
        </div>
      </div>
    </div>
  );
}

export default SearchCard;
