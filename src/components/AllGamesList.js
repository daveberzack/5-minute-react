import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { games } from '../data/games';
import GameListing from './GameListing'

function AllGamesList({ defaultTab = 'all', updateDefaultTab = () => {} }) {

  const {
    favorites,
    addFavorite,
    removeFavorite,
    gamesPlayedToday,
    initializeDailyTracking,
    handleGameLinkClick
  } = useAuth();

  // Initialize daily tracking on component mount
  useEffect(() => {
    initializeDailyTracking();
  }, [initializeDailyTracking]);

  const toggleFavorite = (id, newValue) => {
    if (newValue) addFavorite(id);
    else removeFavorite(id);
  }

  return (
    <div className="max-w-4xl mx-auto p-1">
      {/* Set as Default button - only show if not currently default */}
      {defaultTab !== 'all' && updateDefaultTab && (
          <button
            onClick={() => updateDefaultTab('all')}
            className="bg-blue-800 text-white px-4 py-2 my-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 text-sm"
          >
            Set All Games as Default View
          </button>
      )}
      
        <ul id="other-games-list" className="list-none p-0 w-full">
        { games?.map( (game) => {
          const isFavorite = favorites.includes(game.id);
          const dimGame = gamesPlayedToday.includes(game.id);

          return <GameListing key={game.id} game={game} isFavorite={isFavorite} toggleFavorite={toggleFavorite} dimGame={dimGame} onGameLinkClick={handleGameLinkClick} />
        })}
      </ul>
    </div>
  );

}

export default AllGamesList;