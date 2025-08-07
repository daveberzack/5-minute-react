export const tokenManager = {
    getToken: () => localStorage.getItem('authToken'),
    getRefreshToken: () => localStorage.getItem('refreshToken'),
    
    setTokens(token, refreshToken) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', refreshToken);
    },
    
    clearTokens() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
    }
};