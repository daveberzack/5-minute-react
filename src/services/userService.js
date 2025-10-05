import { apiClient } from './apiClient';

export const userService = {
    async addFriend(username) {
        await apiClient.post('/friends/add/', { username });
        // After adding friend, fetch updated user profile
        const updatedUser = await apiClient.get('/auth/profile/');
        return updatedUser;
    },

    async removeFriend(friendId) {
        await apiClient.delete(`/friends/${friendId}/remove/`);
        // After removing friend, fetch updated user profile
        const updatedUser = await apiClient.get('/auth/profile/');
        return updatedUser;
    },

    async addFavorite(gameId) {
        await apiClient.post('/favorites/add/', { game_id: gameId });
        // After adding favorite, fetch updated user profile
        const updatedUser = await apiClient.get('/auth/profile/');
        return updatedUser;
    },

    async removeFavorite(gameId) {
        await apiClient.delete(`/favorites/${gameId}/remove/`);
        // After removing favorite, fetch updated user profile
        const updatedUser = await apiClient.get('/auth/profile/');
        return updatedUser;
    },

    async updatePlay(gameId, score, message) {
        await apiClient.post('/plays/update/', {
            game_id: gameId,
            score: score,
            message: message || ''
        });
        // After updating play, fetch updated user profile
        const updatedUser = await apiClient.get('/auth/profile/');
        return updatedUser;
    },

    async searchUser(username) {
        // TODO: Implement user search endpoint in Django backend
        console.log('User search not implemented yet');
        return null;
    }
};