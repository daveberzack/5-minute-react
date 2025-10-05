/**
 * Game Activity Storage Utility
 * Pure localStorage operations for game activity tracking
 */

const STORAGE_KEYS = {
  GAMES_PLAYED_TODAY: 'gamesPlayedToday',
  LAST_VISITED_DATE: 'lastVisitedDate',
  LAST_LINK_CLICKED: 'lastLinkClicked',
  LAST_LINK_CLICKED_TIME: 'lastLinkClickedTime',
  LAST_LINK_CLICKED_URL: 'lastLinkClickedUrl'
};

/**
 * Safe localStorage operations with error handling
 */
const storage = {
  get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },

  getString(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Error reading string from localStorage key "${key}":`, error);
      return null;
    }
  },

  setString(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Error writing string to localStorage key "${key}":`, error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  }
};

/**
 * Game activity storage operations
 */
export const gameActivityStorage = {
  // Games played today operations
  getGamesPlayedToday() {
    return storage.get(STORAGE_KEYS.GAMES_PLAYED_TODAY) || [];
  },

  setGamesPlayedToday(gameIds) {
    return storage.set(STORAGE_KEYS.GAMES_PLAYED_TODAY, gameIds);
  },

  // Last visited date operations
  getLastVisitedDate() {
    return storage.getString(STORAGE_KEYS.LAST_VISITED_DATE);
  },

  setLastVisitedDate(date) {
    return storage.setString(STORAGE_KEYS.LAST_VISITED_DATE, date);
  },

  // Recent game click operations
  getRecentGameClick() {
    const gameId = storage.getString(STORAGE_KEYS.LAST_LINK_CLICKED);
    const clickTime = storage.getString(STORAGE_KEYS.LAST_LINK_CLICKED_TIME);
    const gameUrl = storage.getString(STORAGE_KEYS.LAST_LINK_CLICKED_URL);

    if (!gameId || !clickTime) {
      return null;
    }

    return {
      gameId,
      gameUrl,
      clickTime: parseInt(clickTime)
    };
  },

  setRecentGameClick(gameId, gameUrl, clickTime = Date.now()) {
    const success = [
      storage.setString(STORAGE_KEYS.LAST_LINK_CLICKED, gameId.toString()),
      storage.setString(STORAGE_KEYS.LAST_LINK_CLICKED_TIME, clickTime.toString()),
      storage.setString(STORAGE_KEYS.LAST_LINK_CLICKED_URL, gameUrl)
    ].every(Boolean);

    return success;
  },

  clearRecentGameClick() {
    const success = [
      storage.remove(STORAGE_KEYS.LAST_LINK_CLICKED),
      storage.remove(STORAGE_KEYS.LAST_LINK_CLICKED_TIME),
      storage.remove(STORAGE_KEYS.LAST_LINK_CLICKED_URL)
    ].every(Boolean);

    return success;
  }
};

export default gameActivityStorage;