function FavoriteGame({
  game,
  index,
  totalGames,
  isEditMode,
  onMove,
  onGameLinkClick,
  onDeleteCustomLink,
  onRemoveFavorite,
  dimGame
}) {

  const isCustomLink = game.isCustom;
  
  // All items have consistent styling with full rounded corners
  let bgOpacity = 100;
  if (dimGame) bgOpacity = 50;

  return (
    <li
      key={game.id}
      className={`text-blue-800 py-1.5 px-2 flex justify-between items-center group relative transition-all duration-200 my-1 rounded-lg bg-white bg-opacity-${bgOpacity}`}
    >
      {/* Up/Down buttons - only show in edit mode */}
      {isEditMode && (
        <div className="mr-2 flex flex-col gap-0.5">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMove(index, -1);
            }}
            disabled={index === 0}
            className={`w-8 h-4 flex items-center justify-center rounded border-2 transition-colors duration-200 ${
              index === 0
                ? 'bg-gray-200 border-gray-400 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-400 border-blue-800 text-blue-800 hover:bg-yellow-300'
            }`}
            title="Move up"
          >
            <svg className="w-12 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 16l9-9 9 9z"/>
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMove(index, 1);
            }}
            disabled={index === totalGames - 1}
            className={`w-8 h-4 flex items-center justify-center rounded border-2 transition-colors duration-200 ${
              index === totalGames - 1
                ? 'bg-gray-200 border-gray-400 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-400 border-blue-800 text-blue-800 hover:bg-yellow-300'
            }`}
            title="Move down"
          >
            <svg className="w-12 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 8l9 9 9-9z"/>
            </svg>
          </button>
        </div>
      )}
      
      <a
        href={game.url}
        className="block flex hover:text-blue-600 items-center flex-1 min-w-0 mr-3 transition-colors duration-300"
        onClick={(e) => {
          // Only track non-custom links (actual games)
          if (!game.isCustom) {
            onGameLinkClick(game.id, game.url, e);
          }
        }}
      >
        <div className="relative">
          {isCustomLink ? (
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-blue-800 mr-3 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300 flex items-center justify-center text-2xl sm:text-3xl"
              style={{ backgroundColor: game.backgroundColor || '#4F46E5' }}
            >
              {game.emoji || '🎮'}
            </div>
          ) : (
            <img
              src={"./img/games/"+game.image}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-blue-800 mr-3 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300"
              alt={game.name}
            />
          )}
        </div>
        <p className="font-bold text-left text-base sm:text-lg truncate text-blue-800 group-hover:text-blue-600 transition-colors duration-300">{game.name}</p>
      </a>
      
      {/* Delete button - only show in edit mode */}
      {isEditMode && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isCustomLink) {
              onDeleteCustomLink(game.id);
            } else {
              onRemoveFavorite(game.id);
            }
          }}
          className="w-8 h-8 flex items-center justify-center bg-yellow-400 border-2 border-blue-800 text-blue-800 hover:bg-yellow-300 rounded-full transition-colors duration-200"
          title={isCustomLink ? "Delete custom link" : "Remove from favorites"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      )}
    </li>
  );
}

export default FavoriteGame;