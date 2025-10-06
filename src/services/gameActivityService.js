/**
 * Game Activity Service
 * Business logic for game activity tracking and navigation
 */

import gameActivityStorage from '../utils/gameActivityStorage';

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
export const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD format
};

/**
 * Initialize daily tracking - check if it's a new day and reset if needed
 * @returns {string[]} Current games played today
 */
export const initializeDailyTracking = () => {
  const today = getTodayDate();
  const lastVisitedDate = gameActivityStorage.getLastVisitedDate();
  
  // If it's a new day, reset the games played today
  if (lastVisitedDate !== today) {
    gameActivityStorage.setLastVisitedDate(today);
    gameActivityStorage.setGamesPlayedToday([]);
    return [];
  }
  
  return gameActivityStorage.getGamesPlayedToday();
};

/**
 * Mark a game as played today
 * @param {string} gameId The game ID to mark as played
 * @returns {string[]} Updated array of games played today
 */
export const markGameAsPlayed = (gameId) => {
  const gamesPlayedToday = gameActivityStorage.getGamesPlayedToday();
  
  // Only add if not already in the array
  if (!gamesPlayedToday.includes(gameId)) {
    const updatedGames = [...gamesPlayedToday, gameId];
    gameActivityStorage.setGamesPlayedToday(updatedGames);
    return updatedGames;
  }
  
  return gamesPlayedToday;
};

/**
 * Check if a game has been played today
 * @param {string} gameId The game ID to check
 * @returns {boolean} True if the game has been played today
 */
export const hasGameBeenPlayedToday = (gameId) => {
  const gamesPlayedToday = gameActivityStorage.getGamesPlayedToday();
  return gamesPlayedToday.includes(gameId);
};

/**
 * Get all games played today
 * @returns {string[]} Array of game IDs played today
 */
export const getAllGamesPlayedToday = () => {
  return gameActivityStorage.getGamesPlayedToday();
};

/**
 * Clear all games played today (useful for testing)
 */
export const clearGamesPlayedToday = () => {
  gameActivityStorage.setGamesPlayedToday([]);
};

/**
 * Store recent game link click for auto-redirect functionality
 * @param {string} gameId The game ID
 * @param {string} gameUrl The game URL
 * @returns {boolean} True if successfully stored
 */
export const storeRecentGameClick = (gameId, gameUrl) => {
  const clickTime = Date.now();
  const success = gameActivityStorage.setRecentGameClick(gameId, gameUrl, clickTime);
  
  if (success) {
    console.log(`Stored recent game click: ${gameId} at ${new Date(clickTime).toLocaleTimeString()}`);
  }
  
  return success;
};

/**
 * Check if there was a recent game visit (within last 10 minutes) that needs score entry
 * @returns {Object|null} Object with gameId and gameUrl if recent visit found, null otherwise
 */
export const checkForRecentGameVisit = () => {
  const recentClick = gameActivityStorage.getRecentGameClick();
  
  if (!recentClick) {
    return null;
  }
  
  const currentTime = Date.now();
  const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds
  
  // Check if click was within last 10 minutes
  if (currentTime - recentClick.clickTime <= tenMinutesInMs) {
    return {
      gameId: recentClick.gameId,
      gameUrl: recentClick.gameUrl,
      clickTime: recentClick.clickTime
    };
  }
  
  return null;
};

/**
 * Clear recent game visit data (called after score is entered or user dismisses)
 * @returns {boolean} True if successfully cleared
 */
export const clearRecentGameVisit = () => {
  const success = gameActivityStorage.clearRecentGameClick();
  
  if (success) {
    console.log('Cleared recent game visit data');
  }
  
  return success;
};

/**
 * Navigate to a game URL
 * @param {string} gameUrl The game URL to navigate to
 */
export const navigateToGame = (gameUrl) => {
  window.location.href = gameUrl;
};

/**
 * Handle game link click - mark game as played, store recent click, and navigate
 * @param {string} gameId The game ID
 * @param {string} gameUrl The game URL
 * @param {Event} event The click event (optional, for preventDefault)
 * @returns {boolean} True if all operations succeeded
 */
export const handleGameLinkClick = (gameId, gameUrl, event = null) => {
  // Prevent default link behavior if event is provided
  if (event) {
    event.preventDefault();
  }
  
  // Mark the game as played
  markGameAsPlayed(gameId);
  
  // Store recent game click for auto-redirect functionality
  const storeSuccess = storeRecentGameClick(gameId, gameUrl);
  
  // Navigate to the game
  navigateToGame(gameUrl);
  
  return storeSuccess;
};

// All functions are already exported individually above