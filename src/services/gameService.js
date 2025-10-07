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

// Note: Game play retrieval functions removed - now handled by friends dashboard endpoint
// Individual game play operations are managed through the AuthContext

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
// Note: All legacy functions removed - use AuthContext functions instead
// - updatePlay -> use updatePlay from AuthContext
// - addFavorite/removeFavorite -> use localStorageService directly
// - getUserGamePlays/getGamePlayForToday/hasScoreForToday -> use AuthContext functions