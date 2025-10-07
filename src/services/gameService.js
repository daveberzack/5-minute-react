/**
 * Game Service
 * Consolidated service for game plays, user interactions, and game-related operations
 */

import { apiClient } from './apiClient';

// ===== GAME PLAY OPERATIONS =====

/**
 * Update or create a game play record
 * @param {Object} playData - The play data
 * @param {string} playData.game_id - The game ID
 * @param {string} playData.score - The score (optional)
 * @param {string} playData.message - The message (optional)
 * @param {string} playData.play_date - The play date in YYYY-MM-DD format (optional, defaults to today)
 * @returns {Promise<Object>} The updated user profile
 */
export const updateGamePlay = async (playData) => {
  try {
    await apiClient.post('/plays/update/', playData);
    // Return updated user profile to maintain consistency with userService pattern
    const updatedUser = await apiClient.get('/auth/profile/');
    return updatedUser;
  } catch (error) {
    console.error('Error updating game play:', error);
    throw error;
  }
};

/**
 * Get all game plays for the current user
 * @returns {Promise<Array>} Array of game play records
 */
export const getUserGamePlays = async () => {
  try {
    const response = await apiClient.get('/plays/');
    return response.data;
  } catch (error) {
    console.error('Error fetching user game plays:', error);
    throw error;
  }
};

/**
 * Get game plays for a specific date
 * @param {string} date - Date in YYYY-MM-DD format (optional, defaults to today)
 * @returns {Promise<Array>} Array of game play records for the date
 */
export const getGamePlaysForDate = async (date = null) => {
  try {
    const today = date || new Date().toISOString().split('T')[0];
    const plays = await getUserGamePlays();
    
    // Check if plays is defined and is an array before calling filter
    if (!plays || !Array.isArray(plays)) {
      return [];
    }
    
    return plays.filter(play => play.play_date === today);
  } catch (error) {
    console.error('Error fetching game plays for date:', error);
    throw error;
  }
};

/**
 * Get a specific game play for today
 * @param {string} gameId - The game ID
 * @param {string} date - Date in YYYY-MM-DD format (optional, defaults to today)
 * @returns {Promise<Object|null>} The game play record or null if not found
 */
export const getGamePlayForToday = async (gameId, date = null) => {
  try {
    const today = date || new Date().toISOString().split('T')[0];
    const plays = await getUserGamePlays();
    
    // Check if plays is defined and is an array before calling find
    if (!plays || !Array.isArray(plays)) {
      return null;
    }
    
    return plays.find(play => play.game_id === gameId && play.play_date === today) || null;
  } catch (error) {
    console.error('Error fetching game play for today:', error);
    throw error;
  }
};

/**
 * Check if user has a score entered for a game today
 * @param {string} gameId - The game ID
 * @param {string} date - Date in YYYY-MM-DD format (optional, defaults to today)
 * @returns {Promise<boolean>} True if score exists for today
 * @throws {Error} When there's an error checking the score
 */
export const hasScoreForToday = async (gameId, date = null) => {
  try {
    const play = await getGamePlayForToday(gameId, date);
    return play && play.score !== null && play.score !== '';
  } catch (error) {
    console.error('Error checking if score exists for today:', error);
    throw new Error(`Failed to check if score exists for game ${gameId}: ${error.message}`);
  }
};

/**
 * Delete a game play record
 * @param {number} playId - The play record ID
 * @returns {Promise<void>}
 */
export const deleteGamePlay = async (playId) => {
  try {
    await apiClient.delete(`/plays/${playId}/`);
  } catch (error) {
    console.error('Error deleting game play:', error);
    throw error;
  }
};

// ===== USER GAME INTERACTIONS =====
// Note: Favorites are now handled client-side only via localStorage
// See localStorageService for favorites management

// ===== FRIEND OPERATIONS =====

/**
 * Get friends dashboard data (user, friends, today's plays)
 * @returns {Promise<Object>} Dashboard data with user, friends, and today_plays
 */
export const getFriendsDashboard = async () => {
  try {
    const response = await apiClient.get('/friends/dashboard/');
    return response;
  } catch (error) {
    console.error('Error fetching friends dashboard:', error);
    throw error;
  }
};

/**
 * Add a friend by username
 * @param {string} username - The username to add as friend
 * @returns {Promise<void>} Success confirmation
 */
export const addFriend = async (username) => {
  try {
    await apiClient.post('/friends/add/', { username });
  } catch (error) {
    console.error('Error adding friend:', error);
    throw error;
  }
};

/**
 * Remove a friend
 * @param {number} friendId - The friend ID to remove
 * @returns {Promise<void>} Success confirmation
 */
export const removeFriend = async (friendId) => {
  try {
    await apiClient.delete(`/friends/${friendId}/remove/`);
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};

/**
 * Search for a user by username
 * @param {string} username - The username to search for
 * @returns {Promise<Object|null>} The user data or null if not found
 */
export const searchUser = async (username) => {
  try {
    // TODO: Implement user search endpoint in Django backend
    console.log('User search not implemented yet');
    return null;
  } catch (error) {
    console.error('Error searching for user:', error);
    throw error;
  }
};

// ===== LEGACY COMPATIBILITY =====
// These functions maintain compatibility with existing code

/**
 * @deprecated Use updateGamePlay instead
 * Legacy compatibility function for userService.updatePlay
 */
export const updatePlay = async (gameId, score, message) => {
  return updateGamePlay({
    game_id: gameId,
    score: score,
    message: message || ''
  });
};

// Note: addFavorite and removeFavorite legacy functions removed
// Favorites are now handled client-side only via localStorage
// Use localStorageService.addFavorite() and localStorageService.removeFavorite() instead