import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { games } from '../data/games';

function FavoriteGames() {
  const navigate = useNavigate();
  const { user, favorites } = useAuth();

  const [favoriteGames, setFavoriteGames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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
        
        setFavoriteGames(fg);
        
  },[games, user, favorites]);

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

  return (
    <section id="favorite-games" className="">
      {favoriteGames.length > 0 && (
        <>
          {/* Favorites tab */}
          <div className="flex justify-start items-start" style={{ margin: '0.3125rem', marginBottom: 0 }}>
            <div className="bg-blue-800 flex" style={{ borderRadius: '0.3125rem 0.3125rem 0 0' }}>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 font-bold" style={{ borderRadius: '0.3125rem 0.3125rem 0 0' }}>
                Favorites
              </div>
            </div>
          </div>
          
          {/* Header row with user characters */}
          <div className="flex justify-between items-center bg-white" style={{ margin: '0 0.3125rem 0.3125rem 0.3125rem', borderRadius: '0 0 0.3125rem 0.3125rem', padding: '0.75rem 0.5rem' }}>
            <div className="flex items-center space-x-1 flex-shrink-0">
              {/* Current user block */}
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-sm font-bold border-2 border-white/30 shadow-md pulse-on-hover"
                style={{ backgroundColor: user?.color || '#4a90e2', color: 'white' }}
                title={`You (${user?.username})`}
              >
                {user?.character || '👤'}
              </div>
              
              {/* Friends blocks */}
              {user?.friends?.map(friend => (
                <div
                  key={friend.id}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-sm font-bold border-2 border-white/30 shadow-md pulse-on-hover"
                  style={{ backgroundColor: friend.color, color: 'white' }}
                  title={friend.username}
                >
                  {friend.character}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      <ul id="favorite-games-list" className="list-none p-0 w-full">
        { favoriteGames?.map( (f, index) => {
          // Create score blocks for user and friends
          const createScoreBlock = (play, isUser = false, friend = null) => {
            if (play) {
              const hasMessage = play.message && play.message.trim() !== '';
              return (
                <button
                  key={isUser ? 'user' : friend.id}
                  data-id={f.id}
                  data-message={play.message || ''}
                  onClick={isUser ? onClickEditPlay : (hasMessage ? (e) => onClickShowMessage(e, play.message, friend.username) : undefined)}
                  className={`${isUser ? 'btn-gradient hover:scale-105' : 'bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'} text-white w-8 h-8 sm:w-9 sm:h-9 rounded-lg transition-all duration-300 font-medium relative ${play.score.toString().length === 1 ? 'text-sm sm:text-base' : 'text-xs'} flex items-center justify-center shadow-md ${!isUser && !hasMessage ? 'cursor-default' : 'cursor-pointer hover:scale-105'}`}
                  title={isUser ? "Click to edit score" : (hasMessage ? `${friend.username}: Click to view message` : `${friend.username}: ${play.score}`)}
                >
                  {play.score}
                  {hasMessage && (
                    <svg
                      className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-yellow-400 text-gray-800 rounded-full p-0.5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                  )}
                </button>
              );
            } else {
              // Placeholder for missing score
              if (isUser) {
                return (
                  <button
                    key="user"
                    data-id={f.id}
                    onClick={onClickEditPlay}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg btn-gradient text-white flex items-center justify-center hover:scale-105 transition-all duration-300 shadow-md"
                    title="Add score"
                  >
                    <svg width="10" height="10" className="sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                      <path d="m15 5 4 4"/>
                    </svg>
                  </button>
                );
              } else {
                return (
                  <div
                    key={friend.id}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-xs shadow-sm"
                    title={`${friend.username}: No score`}
                  >
                    -
                  </div>
                );
              }
            }
          };

          // First item connects to user characters section, others have normal margins
          const marginStyle = index === 0
            ? { margin: '0 0.3125rem 0.3125rem 0.3125rem', borderRadius: '0 0 0.3125rem 0.3125rem' }
            : { margin: '0.3125rem', borderRadius: '0.3125rem' };

          return (
            <li key={f.id} className="text-blue-800 py-1.5 px-2 flex justify-between items-center group relative bg-white" style={marginStyle}>
              <a href={f.url} className="block flex hover:text-blue-600 items-center flex-1 min-w-0 mr-3 transition-colors duration-300">
                <div className="relative">
                  <img
                    src={"./img/games/"+f.image}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-200 mr-3 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300"
                    alt={f.name}
                  />
                </div>
                <p className="font-bold text-left text-base sm:text-lg truncate text-blue-800 group-hover:text-blue-600 transition-colors duration-300">{f.name}</p>
              </a>
            </li>
          );
        }) }
      </ul>

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
    </section>
  );
}

export default FavoriteGames;