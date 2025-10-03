import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { games } from '../data/games';
import EmojiPicker from 'emoji-picker-react';

function FavoriteGames({ customLinks = [], defaultTab = 'all', updateDefaultTab = () => {} }) {
  const navigate = useNavigate();
  const { user, favorites, addFavorite, removeFavorite } = useAuth();

  const [favoriteGames, setFavoriteGames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
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
        
        // Add custom links at the end
        const allFavorites = [...fg, ...customLinks];
        setFavoriteGames(allFavorites);
        
  },[games, user, favorites, customLinks]);

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
      
      <ul id="favorite-games-list" className="list-none p-0 w-full">
        { favoriteGames?.map( (f, index) => {
          // Check if this is a custom link
          const isCustomLink = f.isCustom;

          // All items have consistent styling with full rounded corners
          const marginStyle = { margin: '0.3125rem', borderRadius: '0.3125rem' };

          return (
            <li key={f.id} className="text-blue-800 py-1.5 px-2 flex justify-between items-center group relative bg-white" style={marginStyle}>
              <a href={f.url} className="block flex hover:text-blue-600 items-center flex-1 min-w-0 mr-3 transition-colors duration-300">
                <div className="relative">
                  {isCustomLink ? (
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-200 mr-3 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300 flex items-center justify-center text-lg sm:text-xl"
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
                  className="w-8 h-8 flex items-center justify-center text-blue-800 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title={isCustomLink ? "Delete custom link" : "Remove from favorites"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </li>
          );
        }) }
      </ul>
      
      {/* Edit Favorites Button */}
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