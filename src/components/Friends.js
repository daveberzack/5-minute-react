import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { games } from '../data/games';
import { useNavigate } from 'react-router-dom';

function Friends() {
  const { user, addFriend, removeFriend, logout, favorites, getUserGamePlays } = useAuth();
  const navigate = useNavigate();
  const [newFriendName, setNewFriendName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentGamePage, setCurrentGamePage] = useState(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [userGamePlays, setUserGamePlays] = useState([]);

  const onClickRemove = (e) => {
    const id = e.target.dataset.id;
    removeFriend(id);
  }

  const onClickAdd = async (e) => {
    const added = await addFriend(newFriendName);
    if (added) {
      setNewFriendName("");
    } else {
      setErrorMessage("User not found");
    }
  }

  const onClickLogout = async () => {
    await logout();
  }

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setErrorMessage(""); // Clear any error messages when toggling
  }

  // Load game plays data when user changes
  useEffect(() => {
    const loadGamePlays = async () => {
      if (!user) return;
      
      try {
        const plays = await getUserGamePlays();
        setUserGamePlays(plays);
      } catch (error) {
        console.error('Error loading game plays:', error);
      }
    };

    loadGamePlays();
  }, [user]);

  // Handle window resize to recalculate columns
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setCurrentGamePage(0); // Reset to first page when screen size changes
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get user's favorite games for table headers
  const favoriteGames = favorites ?
    favorites.map(gameId => games.find(game => game.id === gameId)).filter(Boolean) :
    [];


  // Calculate how many game columns can fit based on screen width
  // Reserve space for padding/margins: ~40px
  const tablePadding = 40;
  const gameColumnWidth = 64; // Fixed width for game columns
  const availableWidth = screenWidth - tablePadding;
  const maxGameColumns = Math.max(1, Math.floor((availableWidth - 120) / gameColumnWidth)); // Reserve min 120px for username
  
  // Dynamic pagination based on screen width
  const gamesPerPage = Math.min(maxGameColumns, favoriteGames.length);
  const totalPages = Math.ceil(favoriteGames.length / gamesPerPage);
  const startIndex = currentGamePage * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  const currentPageGames = favoriteGames.slice(startIndex, endIndex);
  
  // Calculate flexible username column width (fills remaining space)
  const gameColumnsWidth = currentPageGames.length * gameColumnWidth;
  const usernameColumnWidth = availableWidth - gameColumnsWidth;

  const goToNextPage = () => {
    if (currentGamePage < totalPages - 1) {
      setCurrentGamePage(currentGamePage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentGamePage > 0) {
      setCurrentGamePage(currentGamePage - 1);
    }
  };

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Helper function to get score for a specific user and game today
  const getScoreForUserGame = (userId, gameId, isCurrentUser = false) => {
    if (isCurrentUser) {
      // For current user, use the loaded game plays
      // Check if userGamePlays is defined and is an array before calling find
      if (!userGamePlays || !Array.isArray(userGamePlays)) {
        return null;
      }
      
      const today = getTodayDate();
      const play = userGamePlays.find(play =>
        play.game_id === gameId.toString() && play.play_date === today
      );
      return play ? { score: play.score, message: play.message } : null;
    } else {
      // For friends, we'll need to implement this when we have friends' data
      // For now, return null (will show pencil icon)
      return null;
    }
  };

  // Helper function to handle score cell click
  const handleScoreCellClick = (gameId, isCurrentUser) => {
    if (isCurrentUser) {
      // Navigate to edit score form
      navigate(`/edit-score/${gameId}`, {
        state: { from: '/friends' }
      });
    }
  };

  // Create table data: user first, then friends
  const tableData = [
    {
      username: user?.username || '',
      isCurrentUser: true,
      id: null
    },
    ...(user?.friends || []).map(friend => ({
      username: friend.username,
      isCurrentUser: false,
      id: friend.id
    }))
  ];

  return (
    <section id="friends" className="max-w-6xl mx-auto p-2 sm:p-3 relative z-10">
      {/* Scores Table */}
      {!isEditing && (
        <div className="game-card p-4 mb-4">
          <div className="overflow-x-auto">
            <table className="border-collapse" style={{ width: '100%' }}>
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 pl-4" style={{ width: `${usernameColumnWidth}px`, minWidth: `${usernameColumnWidth}px` }}>
                    {favoriteGames.length > gamesPerPage ? (
                      <div className="flex items-center justify-start space-x-1">
                        <button
                          onClick={goToPrevPage}
                          disabled={currentGamePage === 0}
                          className={`w-7 h-7 rounded flex items-center justify-center text-sm ${
                            currentGamePage === 0
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          ←
                        </button>
                        <span className="text-sm text-gray-600 min-w-[30px]">
                          {currentGamePage + 1}/{totalPages}
                        </span>
                        <button
                          onClick={goToNextPage}
                          disabled={currentGamePage >= totalPages - 1}
                          className={`w-7 h-7 rounded flex items-center justify-center text-sm ${
                            currentGamePage >= totalPages - 1
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          →
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Players</span>
                    )}
                  </th>
                  {favoriteGames.length === 0 ? (
                    <th className="text-center py-3 px-2 text-gray-500 italic">
                      Add some favorite games to see them here
                    </th>
                  ) : (
                    <>
                      {currentPageGames.map(game => (
                        <th key={game.id} className="text-center py-3 px-2" style={{ width: `${gameColumnWidth}px`, minWidth: `${gameColumnWidth}px` }}>
                          <img
                            src={`/img/games/${game.image}`}
                            alt={game.name}
                            className="w-12 h-12 mx-auto rounded"
                            title={game.name}
                          />
                        </th>
                      ))}
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {tableData.map((player, index) => (
                  <tr
                    key={player.username}
                    className={`border-b border-gray-100 ${
                      player.isCurrentUser ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="py-3 px-2 pl-4 font-medium text-gray-800 text-left" style={{ width: `${usernameColumnWidth}px`, minWidth: `${usernameColumnWidth}px` }}>
                      {player.username}
                    </td>
                    {favoriteGames.length === 0 ? (
                      <td className="text-center py-3 px-2 text-gray-400">
                        -
                      </td>
                    ) : (
                      <>
                        {currentPageGames.map(game => {
                          const scoreData = getScoreForUserGame(player.id, game.id, player.isCurrentUser);
                          const hasScore = scoreData && scoreData.score;
                          const hasMessage = scoreData && scoreData.message;
                          
                          return (
                            <td
                              key={game.id}
                              className={`text-center py-3 px-2 ${player.isCurrentUser ? 'cursor-pointer hover:bg-blue-100' : ''}`}
                              style={{ width: `${gameColumnWidth}px`, minWidth: `${gameColumnWidth}px` }}
                              onClick={() => player.isCurrentUser && handleScoreCellClick(game.id, player.isCurrentUser)}
                            >
                              {hasScore ? (
                                <div className="relative inline-block">
                                  <span className="text-gray-800 font-medium text-sm">
                                    {scoreData.score}
                                  </span>
                                  {hasMessage && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs">💬</span>
                                    </div>
                                  )}
                                </div>
                              ) : player.isCurrentUser ? (
                                <div className="text-gray-400 hover:text-blue-600 transition-colors">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                  </svg>
                                </div>
                              ) : (
                                <span className="text-gray-300">-</span>
                              )}
                            </td>
                          );
                        })}
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Mode - Friends List */}
      {isEditing && (
        <>
          <ul id="friends-list" className="list-none p-0 space-y-1.5 mb-4">
            {user?.friends?.map(f => (
              <li key={f.id} className="game-card text-gray-800 py-2 px-2.5 flex justify-between items-center group">
                <div className="flex items-center flex-1 min-w-0">
                  <span className="font-medium text-base sm:text-lg truncate">{f.username}</span>
                </div>
                <button
                  data-id={f.id}
                  onClick={onClickRemove}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors duration-200 shadow-sm flex-shrink-0"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none fill-current"
                  >
                    <path d="M19,13H5V11H19V13Z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>

          {/* Add Friend Form */}
          <div className="game-card p-3 mb-4">
            <div className="flex items-center space-x-2">
              <input
                id="new-friend-name"
                placeholder="Enter username to follow"
                value={newFriendName}
                onChange={(e) => { setNewFriendName(e.target.value); setErrorMessage("") }}
                className="form-input flex-grow px-3 py-2.5 text-sm rounded-lg shadow-sm focus:outline-none transition-all duration-300"
              />
              <button
                onClick={onClickAdd}
                className="btn-gradient w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-md flex-shrink-0"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 pointer-events-none fill-current text-white"
                >
                  <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
              </button>
            </div>
            {errorMessage && <p className="text-red-600 text-sm mt-2">{errorMessage}</p>}
          </div>
        </>
      )}

      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={toggleEditMode}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors duration-200 shadow-sm"
        >
          {isEditing ? 'Done Editing' : 'Edit Friends List'}
        </button>
        <button
          onClick={onClickLogout}
          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors duration-200 shadow-sm"
        >
          Log Out
        </button>
      </div>
    </section>
  );
}

export default Friends;