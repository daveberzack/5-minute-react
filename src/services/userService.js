import { apiClient } from './apiClient';

export const userService = {
    async addFriend(username) {
        const response = await apiClient.post('/friends', { username });
        return response.data;
    },

    async removeFriend(friendId) {
        const response = await apiClient.delete(`/friends/${friendId}`);
        return response.data;
    },

    async addFavorite(gameId) {
        const response = await apiClient.post(`/favorites/${gameId}`);
        return response.data;
    },

    async removeFavorite(gameId) {
        const response = await apiClient.delete(`/favorites/${gameId}`);
        return response.data;
    },

    async updatePlay(gameId, score, message) {
        const response = await apiClient.put(`/plays/${gameId}`, { score, message });
        return response.data;
    },

    async updatePreferences(preferences) {
        const response = await apiClient.put('/users/preferences', preferences);
        return response.data;
    },

    async searchUser(username) {
        const response = await apiClient.get(`/users/search/${encodeURIComponent(username)}`);
        return response.success ? response.data : null;
    }
};