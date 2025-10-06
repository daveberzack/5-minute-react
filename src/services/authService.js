import { apiClient } from './apiClient';
import { localStorageService } from './localStorageService';

export const login = async (username, password) => {
    const response = await apiClient.post('/auth/login/', { username, password });
    localStorageService.setAuthTokens(response.token, null); // Django backend doesn't provide refresh token yet
    
    // Return user data directly from login response
    return response.user;
};

export const register = async (username, password) => {
    const response = await apiClient.post('/auth/register/', {
        username, password
    });
    localStorageService.setAuthTokens(response.token, null); // Django backend doesn't provide refresh token yet
    return response.user;
};

export const logout = async () => {
    try {
        const refreshToken = localStorageService.getRefreshToken();
        if (refreshToken) {
            await apiClient.post('/auth/logout/', { refreshToken });
        }
    } finally {
        localStorageService.clearAuthTokens();
    }
};

export const checkAutoLogin = async () => {
    const token = localStorageService.getAuthToken();
    if (!token) return null;
    
    try {
        return await getCurrentUser();
    } catch {
        localStorageService.clearAuthTokens();
        return null;
    }
};

export const getCurrentUser = async () => {
    const response = await apiClient.get('/auth/profile/');
    console.log("getCurrentUser", response);
    return response;
};