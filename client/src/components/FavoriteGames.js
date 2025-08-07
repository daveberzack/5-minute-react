import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { games } from '../games';

function FavoriteGames() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [favoriteGames, setFavoriteGames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(()=>{
        
        let fg = user?.favorites.map( favoriteId => {
            return games.find( g => g.id == favoriteId )
        });
        fg = fg || [];
        fg.forEach( game => {
          const myPlay = user.todayPlays[game.id];
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
        
        setFavoriteGames(fg);
        
  },[games, user]);

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
    <section id="favorite-games" className="max-w-4xl mx-auto p-1 sm:p-2">
      {/* Header row showing user characters */}
      {favoriteGames.length > 0 && (
        <div className="flex justify-between items-center mb-1 px-1">
          <div className="flex-1 min-w-0 mr-2">
            {/* Empty space to align with game info */}
          </div>
          <div className="flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0">
            {/* Current user block */}
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded flex items-center justify-center text-lg font-bold border-2 border-black"
              style={{ backgroundColor: user?.color || '#333366', color: 'white' }}
              title={`You (${user?.username})`}
            >
              {user?.character || '👤'}
            </div>
            
            {/* Friends blocks */}
            {user?.friends?.map(friend => (
              <div
                key={friend.id}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded flex items-center justify-center text-lg font-bold border-2 border-black"
                style={{ backgroundColor: friend.color, color: 'white' }}
                title={friend.username}
              >
                {friend.character}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <ul id="favorite-games-list" className="list-none p-0 space-y-1 sm:space-y-2">
        { favoriteGames?.map( f => {
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
                  className={`${isUser ? 'bg-blue-600 hover:bg-[#282850]' : 'bg-gray-500 hover:bg-gray-600'} text-white w-8 h-8 sm:w-9 sm:h-9 rounded transition-colors duration-200 font-medium relative ${play.score.toString().length === 1 ? 'text-base sm:text-lg' : 'text-xs'} flex items-center justify-center ${!isUser && !hasMessage ? 'cursor-default' : 'cursor-pointer'}`}
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
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded bg-blue-600 text-white flex items-center justify-center hover:bg-[#282850] transition-colors duration-200 shadow-sm"
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
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded bg-gray-300 flex items-center justify-center text-gray-500 text-xs"
                    title={`${friend.username}: No score`}
                  >
                    -
                  </div>
                );
              }
            }
          };

          // Create all score blocks
          const scoreBlocks = [];
          
          // User's score (leftmost)
          scoreBlocks.push(createScoreBlock(f.scores?.me, true));
          
          // Friends' scores
          Object.values(f.scores?.friends || {}).forEach(({ play, friend }) => {
            scoreBlocks.push(createScoreBlock(play, false, friend));
          });

          return (
            <li key={f.id} className="bg-white text-black rounded-lg shadow-sm py-1 px-1 hover:shadow-lg transition-all duration-300 flex justify-between items-center">
              <a href={f.url} className="block flex hover:text-blue-600 items-center flex-1 min-w-0 mr-2">
                <img src={"./img/games/"+f.image} className="w-8 h-8 sm:w-9 sm:h-9 rounded-md border-2 border-black mr-2 flex-shrink-0"/>
                <p className="font-bold text-left text-base sm:text-lg truncate">{f.name}</p>
              </a>
              <div className="flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0">
                {scoreBlocks}
              </div>
            </li>
          );
        }) }
      </ul>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-gray-700 mb-4 text-sm sm:text-base">{modalMessage}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default FavoriteGames;