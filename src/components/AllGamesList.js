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
    <div className="max-w-4xl mx-auto p-4">
      {/* Set as Default button - only show if not currently default */}
      {defaultTab !== 'all' && updateDefaultTab && (
        <div className="mb-4">
          <button
            onClick={() => updateDefaultTab('all')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 text-sm"
          >
            Set All Games as Default View
          </button>
        </div>
      )}
      
        <ul id="other-games-list" className="list-none p-0 w-full">
        { games?.map( (game) => {
          const isFavorite = favorites.includes(game.id*1);
          const dimGame = gamesPlayedToday.includes(game.id*1);

          return <GameListing key={game.id} game={game} isFavorite={isFavorite} toggleFavorite={toggleFavorite} dimGame={dimGame} onGameLinkClick={handleGameLinkClick} />   
        })}
      </ul>
    </div>
  );

}

export default AllGamesList;