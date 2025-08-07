import { apiClient } from './apiClient';
import { tokenManager } from './tokenManager';

export const authService = {
    async login(email, password) {
        const response = await apiClient.post('/auth/login', { email, password });
        tokenManager.setTokens(response.data.token, response.data.refreshToken);
        
        // Always fetch complete user data after login
        return await this.getCurrentUser();
    },

    async register(email, password, username, character, color) {
        const response = await apiClient.post('/auth/register', {
            email, password, username, character, color
        });
        tokenManager.setTokens(response.data.token, response.data.refreshToken);
        return await this.getCurrentUser();
    },

    async logout() {
        try {
            const refreshToken = tokenManager.getRefreshToken();
            if (refreshToken) {
                await apiClient.post('/auth/logout', { refreshToken });
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
        const response = await apiClient.get('/users/profile');
        console.log("getCurrentUser", response.data);
        return response.data;
    }
};