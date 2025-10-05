import { apiClient } from './apiClient';
import { tokenManager } from './tokenManager';

export const authService = {
    async login(username, password) {
        const response = await apiClient.post('/auth/login/', { username, password });
        tokenManager.setTokens(response.token, null); // Django backend doesn't provide refresh token yet
        
        // Return user data directly from login response
        return response.user;
    },

    async register(username, password) {
        const response = await apiClient.post('/auth/register/', {
            username, password
        });
        tokenManager.setTokens(response.token, null); // Django backend doesn't provide refresh token yet
        return response.user;
    },

    async logout() {
        try {
            const refreshToken = tokenManager.getRefreshToken();
            if (refreshToken) {
                await apiClient.post('/auth/logout/', { refreshToken });
            }
        } finally {
            tokenManager.clearTokens();
        }
    },

    async checkAutoLogin() {
        const token = tokenManager.getToken();
        if (!token) return null;
        
        try {
            return await this.getCurrentUser();
        } catch {
            tokenManager.clearTokens();
            return null;
        }
    },

    async getCurrentUser() {
        const response = await apiClient.get('/auth/profile/');
        console.log("getCurrentUser", response);
        return response;
    }
};