function GameListing({isFavorite, toggleFavorite, onGameLinkClick, game, dimGame}) {

    const onClickFavorite = (e)=> {
      const id = e.target.dataset.id;
      const isFavorite = e.target.dataset.isFavorite==="true";
      if (isFavorite) toggleFavorite(id, false);
      else toggleFavorite(id, true);
    }

      let bgOpacity = 100;
      if (dimGame) bgOpacity = 50;

      return (
        <li className={`text-blue-800 py-1.5 px-2 flex justify-between items-center group relative rounded-lg my-1 bg-white bg-opacity-${bgOpacity}`}>
          <a
            href={game.url}
            className="block flex flex-1 min-w-0"
            onClick={(e) => onGameLinkClick(game.id, game.url, e)}
          >
            <img
                src={"./img/games/"+game.image}
                className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-blue-800 mr-3 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300"
                alt={game.name}
            />
            <div className="text-left min-w-0 flex-1 flex flex-col justify-center">
              <p className="font-bold text-base sm:text-lg truncate mb-0.5 text-blue-800">{game.name}</p>
              <p className="text-xs sm:text-sm text-blue-800 line-clamp-2">{game.caption}</p>
            </div>
          </a>
          
          <img
            data-id={game.id}
            data-is-favorite={isFavorite}
            onClick={onClickFavorite}
            className="mr-1 flex items-center justify-center focus:outline-none flex-shrink-0"
            src={isFavorite ? "./img/star_full.png" : "./img/star_empty.png"} alt={isFavorite ? "Remove from favorites" : "Add to favorites"}
          />

        </li>
      );
}

export default GameListing;