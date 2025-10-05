/**
 * Game Activity Service
 * Tracks which games have been played today using localStorage
 */

const STORAGE_KEYS = {
  GAMES_PLAYED_TODAY: 'gamesPlayedToday',
  LAST_VISITED_DATE: 'lastVisitedDate'
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD format
};

/**
 * Get games played today from localStorage
 * @returns {string[]} Array of game IDs played today
 */
const getGamesPlayedToday = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GAMES_PLAYED_TODAY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Error reading games played today:', error);
    return [];
  }
};

/**
 * Get last visited date from localStorage
 * @returns {string|null} Last visited date or null
 */
const getLastVisitedDate = () => {
  return localStorage.getItem(STORAGE_KEYS.LAST_VISITED_DATE);
};

/**
 * Save games played today to localStorage
 * @param {string[]} gameIds Array of game IDs
 */
const saveGamesPlayedToday = (gameIds) => {
  try {
    localStorage.setItem(STORAGE_KEYS.GAMES_PLAYED_TODAY, JSON.stringify(gameIds));
  } catch (error) {
    console.warn('Error saving games played today:', error);
  }
};

/**
 * Save last visited date to localStorage
 * @param {string} date Date in YYYY-MM-DD format
 */
const saveLastVisitedDate = (date) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_VISITED_DATE, date);
  } catch (error) {
    console.warn('Error saving last visited date:', error);
  }
};

/**
 * Initialize daily tracking - check if it's a new day and reset if needed
 * @returns {string[]} Current games played today
 */
const initializeDailyTracking = () => {
  const today = getTodayDate();
  const lastVisitedDate = getLastVisitedDate();
  
  // If it's a new day, reset the games played today
  if (lastVisitedDate !== today) {
    saveLastVisitedDate(today);
    saveGamesPlayedToday([]);
    return [];
  }
  
  return getGamesPlayedToday();
};

/**
 * Mark a game as played today
 * @param {string} gameId The game ID to mark as played
 * @returns {string[]} Updated array of games played today
 */
const markGameAsPlayed = (gameId) => {
  const gamesPlayedToday = getGamesPlayedToday();
  
  // Only add if not already in the array
  if (!gamesPlayedToday.includes(gameId)) {
    gamesPlayedToday.push(gameId);
    saveGamesPlayedToday(gamesPlayedToday);
  }
  
  return gamesPlayedToday;
};

/**
 * Check if a game has been played today
 * @param {string} gameId The game ID to check
 * @returns {boolean} True if the game has been played today
 */
const hasGameBeenPlayedToday = (gameId) => {
  const gamesPlayedToday = getGamesPlayedToday();
  return gamesPlayedToday.includes(gameId);
};

/**
 * Get all games played today
 * @returns {string[]} Array of game IDs played today
 */
const getAllGamesPlayedToday = () => {
  return getGamesPlayedToday();
};

/**
 * Clear all games played today (useful for testing)
 */
const clearGamesPlayedToday = () => {
  saveGamesPlayedToday([]);
};

/**
 * Handle game link click - mark game as played and open link
 * @param {string} gameId The game ID
 * @param {string} gameUrl The game URL
 * @param {Event} event The click event (optional, for preventDefault)
 */
const handleGameLinkClick = (gameId, gameUrl, event = null) => {
  // Mark the game as played
  markGameAsPlayed(gameId);
  
  // Open the game in a new tab/window
  window.open(gameUrl, '_blank', 'noopener,noreferrer');
  
  // Prevent default link behavior if event is provided
  if (event) {
    event.preventDefault();
  }
};

export {
  initializeDailyTracking,
  markGameAsPlayed,
  hasGameBeenPlayedToday,
  getAllGamesPlayedToday,
  clearGamesPlayedToday,
  handleGameLinkClick,
  getTodayDate
};