import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { games } from '../data/games';
import { localStorageService } from '../services/localStorageService';
import Modal, { useModal } from './Modal';
import AddCustomLink from './AddCustomLink';
import FavoriteGame from './FavoriteGame';

function FavoriteGamesList({ customLinks = [], defaultTab = 'all', updateDefaultTab = () => {} }) {
  const {
    user,
    favorites,
    removeFavorite,
    gamesPlayedToday,
    initializeDailyTracking,
    handleGameLinkClick
  } = useAuth();
  const { isOpen: showModal, message: modalMessage, title: modalTitle, closeModal } = useModal();

  const [favoriteGames, setFavoriteGames] = useState([]);
  const [favoriteOrder, setFavoriteOrder] = useState(() => {
    return localStorageService.getFavoriteOrder();
  });
  const [isEditMode, setIsEditMode] = useState(false);

  // Initialize daily tracking on component mount
  useEffect(() => {
    initializeDailyTracking();
  }, [initializeDailyTracking]);

  useEffect(()=>{
        let fg = favorites.map( favoriteId => {
            return games.find( g => g.id === favoriteId )
        }).filter(game => game !== undefined); // Filter out undefined games
        fg = fg || [];
        
        // Combine favorites and custom links
        const allFavorites = [...fg, ...customLinks];
        
        // Apply saved order if it exists
        if (favoriteOrder.length > 0) {
          const orderedFavorites = [];
          const unorderedFavorites = [...allFavorites];
          
          // First, add items in the saved order
          favoriteOrder.forEach(itemId => {
            const itemIndex = unorderedFavorites.findIndex(item =>
              (item.isCustom ? `custom-${item.id}` : `game-${item.id}`) === itemId
            );
            if (itemIndex !== -1) {
              orderedFavorites.push(unorderedFavorites.splice(itemIndex, 1)[0]);
            }
          });
          
          // Then add any new items that weren't in the saved order
          orderedFavorites.push(...unorderedFavorites);
          
          setFavoriteGames(orderedFavorites);
        } else {
          setFavoriteGames(allFavorites);
        }
        
  },[user, favorites, customLinks, favoriteOrder]);

  const handleRemoveFavorite = (gameId) => {
    removeFavorite(gameId);
  }

  const handleDeleteCustomLink = (linkId) => {
    localStorageService.removeCustomLink(linkId);
  }

  // Move item in the list (direction: -1 for up, 1 for down)
  const handleMove = (index, direction) => {
    const newIndex = index + direction;
    
    // Check bounds
    if (newIndex < 0 || newIndex >= favoriteGames.length) return;
    
    const newFavorites = [...favoriteGames];
    const temp = newFavorites[index];
    newFavorites[index] = newFavorites[newIndex];
    newFavorites[newIndex] = temp;
    
    // Update the state
    setFavoriteGames(newFavorites);
    
    // Save the new order to localStorage
    const newOrder = newFavorites.map(item =>
      item.isCustom ? `custom-${item.id}` : `game-${item.id}`
    );
    setFavoriteOrder(newOrder);
    localStorageService.setFavoriteOrder(newOrder);
  };

  // Handle game link clicks
  const onGameLinkClick = (gameId, gameUrl, event) => {
    handleGameLinkClick(gameId, gameUrl, event);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Set as Default button - only show if not currently default */}
      {defaultTab !== 'favorites' && updateDefaultTab && (
        <div className="mb-4">
          <button
            onClick={() => updateDefaultTab('favorites')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 text-sm"
          >
            Set Favorites as Default
          </button>
        </div>
      )}
      
      {favoriteGames && favoriteGames.length > 0 ? (
        <ul id="favorite-games-list" className="list-none p-0 w-full">
          {favoriteGames?.map((game, index) => {
            
            const dimGame = gamesPlayedToday.includes(game.id*1);

            return <FavoriteGame
              key={game.id}
              game={game}
              index={index}
              totalGames={favoriteGames.length}
              isEditMode={isEditMode}
              onMove={handleMove}
              onGameLinkClick={onGameLinkClick}
              onDeleteCustomLink={handleDeleteCustomLink}
              onRemoveFavorite={handleRemoveFavorite}
              dimGame={dimGame}
            />
          })}
        </ul>
      ) : (
        <div className="text-center py-12 px-4">
          <div className="bg-blue-50 rounded-lg p-8 border-2 border-dashed border-blue-200">
            <svg className="w-16 h-16 mx-auto text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
            </svg>
            <h3 className="text-xl font-bold text-blue-800 mb-2">No Favorites Yet</h3>
            <p className="text-blue-600 mb-4">
              Start building your favorites list by clicking the star icons on games in the All Games tab.
            </p>
            <p className="text-blue-500 text-sm">
              You can also add custom links here once you have some favorites!
            </p>
          </div>
        </div>
      )}
      
      {/* Edit Favorites Button - only show if there are favorites or custom links */}
      {favoriteGames && favoriteGames.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="w-full bg-blue-800 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {isEditMode ? 'Done Editing' : 'Edit Favorites'}
          </button>
        </div>
      )}

      {/* Add Custom Link Form - only show in edit mode */}
      {isEditMode && <AddCustomLink />}

      {/* Modal Dialog */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        message={modalMessage}
        title={modalTitle}
      />
    </div>
  );
}

export default FavoriteGamesList;