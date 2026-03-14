function SearchCard({ name, artist, albumArt, Album }) {
  function handleClick() {
    console.log("clicked :]");
  }

  return (
    <div
      className="bg-zinc-600 p-4 m-4 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-green-500/50 transition-transform duration-200 hover:scale-101"
      onClick={handleClick}
    >
      <div className="flex gap-4 items-center">
        <img src={albumArt} alt={Album} className="w-16 h-16 rounded-md" />
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold">{name}</h2>
          <p>{artist}</p>
          <p>{Album}</p>
        </div>
      </div>
    </div>
  );
}

export default SearchCard;
