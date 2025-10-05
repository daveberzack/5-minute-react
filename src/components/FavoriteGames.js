import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { games } from '../data/games';
import EmojiPicker from 'emoji-picker-react';
import { initializeDailyTracking, hasGameBeenPlayedToday, handleGameLinkClick } from '../services/gameActivityService';

function FavoriteGames({ customLinks = [], defaultTab = 'all', updateDefaultTab = () => {} }) {
  const navigate = useNavigate();
  const { user, favorites, addFavorite, removeFavorite } = useAuth();

  const [favoriteGames, setFavoriteGames] = useState([]);
  const [gamesPlayedToday, setGamesPlayedToday] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [favoriteOrder, setFavoriteOrder] = useState(() => {
    const saved = localStorage.getItem('favoriteOrder');
    return saved ? JSON.parse(saved) : [];
  });
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Add form state
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [emoji, setEmoji] = useState('🎮');
  const [backgroundColor, setBackgroundColor] = useState('#4F46E5');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Refs for click outside detection
  const emojiPickerRef = useRef(null);
  const colorPickerRef = useRef(null);
  
  // Web-safe color palette
  const webSafeColors = [
    '#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00', '#FFFF00',
    '#CCFF00', '#99FF00', '#66FF00', '#33FF00', '#00FF00', '#00FF33',
    '#00FF66', '#00FF99', '#00FFCC', '#00FFFF', '#00CCFF', '#0099FF',
    '#0066FF', '#0033FF', '#0000FF', '#3300FF', '#6600FF', '#9900FF',
    '#CC00FF', '#FF00FF', '#FF00CC', '#FF0099', '#FF0066', '#FF0033',
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
    '#C0C0C0', '#808080', '#FF6666', '#66FF66', '#6666FF', '#FFFF66',
    '#FF66FF', '#66FFFF', '#990000', '#009900', '#000099', '#999900',
    '#990099', '#009999', '#CC0000', '#00CC00', '#0000CC', '#CCCC00',
    '#CC00CC', '#00CCCC'
  ];

  // Initialize daily tracking on component mount
  useEffect(() => {
    const playedToday = initializeDailyTracking();
    setGamesPlayedToday(playedToday);
  }, []);

  useEffect(()=>{
        let fg = favorites.map( favoriteId => {
            return games.find( g => g.id == favoriteId )
        });
        fg = fg || [];
        
        // Only add scores and friends data if user is authenticated
        if (user) {
          fg.forEach( game => {
            const myPlay = user.todayPlays?.[game.id];
            game.scores = {
              me: myPlay,
              friends: {}
            };
            
            // Add friends' scores
            user.friends?.forEach(friend => {
              const friendPlay = friend.todayPlays?.[game.id];
              game.scores.friends[friend.id] = {
                play: friendPlay,
                friend: friend
              };
            });
          });
        } else {
          // For unauthenticated users, just set empty scores
          fg.forEach( game => {
            game.scores = {
              me: null,
              friends: {}
            };
          });
        }
        
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
        
  },[games, user, favorites, customLinks, favoriteOrder]);

  const onClickEditPlay = (e)=> {
    const id = e.currentTarget.dataset.id;
    navigate(`/edit-score/${id}`);
  }

  const onClickShowMessage = (e, message, friendName = '') => {
    e.stopPropagation(); // Prevent navigation
    setModalMessage(message);
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
  }

  const handleRemoveFavorite = (gameId) => {
    removeFavorite(gameId);
  }

  const handleDeleteCustomLink = (linkId) => {
    const existingLinks = JSON.parse(localStorage.getItem('customLinks') || '[]');
    const updatedLinks = existingLinks.filter(link => link.id !== linkId);
    localStorage.setItem('customLinks', JSON.stringify(updatedLinks));
    
    // Trigger custom event for updates
    window.dispatchEvent(new Event('customLinksUpdated'));
  }

  const handleAddCustomLink = (e) => {
    e.preventDefault();
    if (name.trim() && url.trim()) {
      // Get existing custom links
      const existingLinks = JSON.parse(localStorage.getItem('customLinks') || '[]');
      
      const newLink = {
        name: name.trim(),
        url: url.trim(),
        emoji: emoji,
        backgroundColor: backgroundColor,
        id: Date.now(),
        isCustom: true
      };
      
      // Add new link
      const updatedLinks = [...existingLinks, newLink];
      localStorage.setItem('customLinks', JSON.stringify(updatedLinks));
      
      // Trigger custom event for same-tab updates
      window.dispatchEvent(new Event('customLinksUpdated'));
      
      // Reset form
      setName('');
      setUrl('');
      setEmoji('🎮');
      setBackgroundColor('#4F46E5');
      setShowEmojiPicker(false);
      setShowColorPicker(false);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setEmoji(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Move item up in the list
  const handleMoveUp = (index) => {
    if (index === 0) return; // Can't move first item up
    
    const newFavorites = [...favoriteGames];
    const temp = newFavorites[index];
    newFavorites[index] = newFavorites[index - 1];
    newFavorites[index - 1] = temp;
    
    // Update the state
    setFavoriteGames(newFavorites);
    
    // Save the new order to localStorage
    const newOrder = newFavorites.map(item =>
      item.isCustom ? `custom-${item.id}` : `game-${item.id}`
    );
    setFavoriteOrder(newOrder);
    localStorage.setItem('favoriteOrder', JSON.stringify(newOrder));
  };

  // Move item down in the list
  const handleMoveDown = (index) => {
    if (index === favoriteGames.length - 1) return; // Can't move last item down
    
    const newFavorites = [...favoriteGames];
    const temp = newFavorites[index];
    newFavorites[index] = newFavorites[index + 1];
    newFavorites[index + 1] = temp;
    
    // Update the state
    setFavoriteGames(newFavorites);
    
    // Save the new order to localStorage
    const newOrder = newFavorites.map(item =>
      item.isCustom ? `custom-${item.id}` : `game-${item.id}`
    );
    setFavoriteOrder(newOrder);
    localStorage.setItem('favoriteOrder', JSON.stringify(newOrder));
  };

  // Handle game link clicks
  const onGameLinkClick = (gameId, gameUrl, event) => {
    handleGameLinkClick(gameId, gameUrl, event);
    // Update local state to reflect the change immediately
    setGamesPlayedToday(prev => {
      if (!prev.includes(gameId)) {
        return [...prev, gameId];
      }
      return prev;
    });
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
          { favoriteGames?.map( (f, index) => {
            // Check if this is a custom link
            const isCustomLink = f.isCustom;

            // All items have consistent styling with full rounded corners
          let itemStyle = { margin: '0.3125rem', borderRadius: '0.3125rem' };
          if (hasGameBeenPlayedToday(f.id)) itemStyle.backgroundColor = "#FFFFFF99"

            return (
            <li
              key={f.id}
              className={`text-blue-800 py-1.5 px-2 flex justify-between items-center group relative transition-all duration-200 bg-white`}
              style={itemStyle}
            >
              {/* Up/Down buttons - only show in edit mode */}
              {isEditMode && (
                <div className="mr-2 flex flex-col gap-0.5">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleMoveUp(index);
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
                      handleMoveDown(index);
                    }}
                    disabled={index === favoriteGames.length - 1}
                    className={`w-8 h-4 flex items-center justify-center rounded border-2 transition-colors duration-200 ${
                      index === favoriteGames.length - 1
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
                href={f.url}
                className="block flex hover:text-blue-600 items-center flex-1 min-w-0 mr-3 transition-colors duration-300"
                onClick={(e) => {
                  // Only track non-custom links (actual games)
                  if (!f.isCustom) {
                    onGameLinkClick(f.id, f.url, e);
                  }
                }}
              >
                <div className="relative">
                  {isCustomLink ? (
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-200 mr-3 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300 flex items-center justify-center text-2xl sm:text-3xl"
                      style={{ backgroundColor: f.backgroundColor || '#4F46E5' }}
                    >
                      {f.emoji || '🎮'}
                    </div>
                  ) : (
                    <img
                      src={"./img/games/"+f.image}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-200 mr-3 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300"
                      alt={f.name}
                    />
                  )}
                </div>
                <p className="font-bold text-left text-base sm:text-lg truncate text-blue-800 group-hover:text-blue-600 transition-colors duration-300">{f.name}</p>
              </a>
              
              {/* Delete button - only show in edit mode */}
              {isEditMode && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isCustomLink) {
                      handleDeleteCustomLink(f.id);
                    } else {
                      handleRemoveFavorite(f.id);
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
          }) }
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
      {isEditMode && (
        <div className="mt-4 bg-blue-100" style={{ borderRadius: '0.3125rem', padding: '1.5rem' }}>
          <h3 className="text-blue-800 text-lg font-bold mb-4">Add Custom Link</h3>
          <form onSubmit={handleAddCustomLink} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-blue-800 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter game name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="url" className="block text-blue-800 font-medium mb-2">
                URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
                required
              />
            </div>
            
            <div className="relative" ref={emojiPickerRef}>
              <label className="block text-blue-800 font-medium mb-2">
                Emoji
              </label>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-blue-50 transition-colors duration-200 flex items-center justify-between"
              >
                <span className="flex items-center space-x-2">
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-blue-800">Click to choose emoji</span>
                </span>
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showEmojiPicker && (
                <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-blue-300 rounded-lg shadow-lg">
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    width={300}
                    height={400}
                    previewConfig={{
                      showPreview: false
                    }}
                  />
                </div>
              )}
            </div>

            <div className="relative" ref={colorPickerRef}>
              <label className="block text-blue-800 font-medium mb-2">
                Background Color
              </label>
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-blue-50 transition-colors duration-200 flex items-center justify-between"
              >
                <span className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-lg shadow-sm"
                    style={{ backgroundColor: backgroundColor }}
                  >
                    {emoji}
                  </div>
                  <span className="text-blue-800">Click to choose color</span>
                  <span className="text-blue-600 text-sm font-mono">{backgroundColor}</span>
                </span>
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showColorPicker && (
                <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-blue-300 rounded-lg shadow-lg p-4">
                  <div className="grid grid-cols-12 gap-1 max-w-xs">
                    {webSafeColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          setBackgroundColor(color);
                          setShowColorPicker(false);
                        }}
                        className={`w-6 h-6 rounded border-2 transition-all duration-200 hover:scale-110 ${
                          backgroundColor === color ? 'border-blue-800 shadow-lg' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-900 transition-colors duration-200"
            >
              Add Link
            </button>
          </form>
        </div>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="glass-card p-4 sm:p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">Friend's Message</h3>
            </div>
            <p className="text-gray-700 text-center text-sm leading-relaxed mb-3">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="w-full btn-gradient py-2 px-4 rounded-lg font-medium text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FavoriteGames;