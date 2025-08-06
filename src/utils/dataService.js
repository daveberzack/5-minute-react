// API-based data service to replace Firebase
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:5001/api';

let today = "";
let currentUser = null;

// Token management
const getToken = () => localStorage.getItem('authToken');
const setToken = (token) => localStorage.setItem('authToken', token);
const removeToken = () => localStorage.removeItem('authToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setRefreshToken = (token) => localStorage.setItem('refreshToken', token);
const removeRefreshToken = () => localStorage.removeItem('refreshToken');

// HTTP client with automatic token handling
const apiClient = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = getToken();
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            // Handle token expiration
            if (response.status === 401) {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    // Retry the original request with new token
                    config.headers.Authorization = `Bearer ${getToken()}`;
                    const retryResponse = await fetch(url, config);
                    return await this.handleResponse(retryResponse);
                } else {
                    // Refresh failed, redirect to login
                    removeToken();
                    removeRefreshToken();
                    currentUser = null;
                    throw new Error('Authentication failed');
                }
            }

            return await this.handleResponse(response);
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },

    async handleResponse(response) {
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    },

    async refreshToken() {
        const refreshToken = getRefreshToken();
        if (!refreshToken) return false;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                setToken(data.data.token);
                setRefreshToken(data.data.refreshToken);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
        }

        return false;
    },

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },
};

export const dataService = {
    init: function(todayString) {
        today = todayString;
    },

    checkAutoLogin: function(setUserData) {
        console.log("auto");
        
        // Check if we have a stored token
        const token = getToken();
        if (token) {
            // Try to get user profile to validate token
            this.loadData()
                .then(userData => {
                    if (userData) {
                        currentUser = userData;
                        setUserData(userData);
                        console.log("auto newUserData", userData);
                    } else {
                        setUserData(null);
                    }
                })
                .catch(error => {
                    console.error("Auto-login failed:", error);
                    removeToken();
                    removeRefreshToken();
                    setUserData(null);
                });
        } else {
            console.log("No stored token found");
            setUserData(null);
        }

        // Return a cleanup function (Firebase compatibility)
        return () => {};
    },

    signInWithGoogle: async function() {
        // This would need to be implemented with Google OAuth
        // For now, we'll throw an error to indicate it needs implementation
        throw new Error("Google sign-in needs to be implemented with Google OAuth flow");
    },

    signOutUser: async function() {
        try {
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                await apiClient.post('/auth/logout', { refreshToken });
            }
        } catch (error) {
            console.error("Logout API call failed:", error);
        } finally {
            removeToken();
            removeRefreshToken();
            currentUser = null;
        }
    },

    signUpWithEmail: async function(email, password, username, character, color) {
        try {
            const response = await apiClient.post('/auth/register', {
                email,
                password,
                username,
                character,
                color
            });

            if (response.success) {
                setToken(response.data.token);
                setRefreshToken(response.data.refreshToken);
                currentUser = response.data.user;
                return response.data.user;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    },

    signInWithEmail: async function(email, password) {
        try {
            const response = await apiClient.post('/auth/login', {
                email,
                password
            });

            if (response.success) {
                setToken(response.data.token);
                setRefreshToken(response.data.refreshToken);
                currentUser = response.data.user;
                return response.data.user;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    },

    findUserByUsername: async function(username) {
        try {
            const response = await apiClient.get(`/users/search/${encodeURIComponent(username)}`);
            return response.success ? response.data : null;
        } catch (error) {
            console.error("User search failed:", error);
            return null;
        }
    },

    loadData: async function() {
        try {
            const response = await apiClient.get('/users/profile');
            if (response.success) {
                currentUser = response.data;
                return response.data;
            }
            return null;
        } catch (error) {
            console.error("Load data failed:", error);
            return null;
        }
    },

    setPreferences: async function(newPreferences) {
        try {
            const response = await apiClient.put('/users/preferences', newPreferences);
            if (response.success) {
                currentUser = response.data;
            }
        } catch (error) {
            console.error("Set preferences failed:", error);
            throw error;
        }
    },

    addFavorite: async function(gameId) {
        try {
            const response = await apiClient.post(`/favorites/${gameId}`);
            if (response.success) {
                currentUser = response.data;
                return response.data;
            }
            throw new Error(response.message);
        } catch (error) {
            console.error("Add favorite failed:", error);
            throw error;
        }
    },

    removeFavorite: async function(gameId) {
        try {
            const response = await apiClient.delete(`/favorites/${gameId}`);
            if (response.success) {
                currentUser = response.data;
                return response.data;
            }
            throw new Error(response.message);
        } catch (error) {
            console.error("Remove favorite failed:", error);
            throw error;
        }
    },

    setFriends: async function(newFriendIds) {
        // This is complex since we need to handle adding/removing friends
        // For now, we'll reload the data after the operation
        try {
            // The friends management is handled through addFriend/removeFriend
            // This method is called after those operations, so we just reload
            const userData = await this.loadData();
            currentUser = userData;
        } catch (error) {
            console.error("Set friends failed:", error);
            throw error;
        }
    },

    addFriend: async function(username) {
        try {
            const response = await apiClient.post('/friends', { username });
            if (response.success) {
                currentUser = response.data;
                return response.data;
            }
            throw new Error(response.message);
        } catch (error) {
            console.error("Add friend failed:", error);
            throw error;
        }
    },

    removeFriend: async function(friendId) {
        try {
            const response = await apiClient.delete(`/friends/${friendId}`);
            if (response.success) {
                currentUser = response.data;
                return response.data;
            }
        } catch (error) {
            console.error("Remove friend failed:", error);
            throw error;
        }
    },

    updatePlay: async function(gameId, score, message) {
        try {
            const response = await apiClient.put(`/plays/${gameId}`, {
                score,
                message
            });
            
            if (response.success) {
                currentUser = response.data;
            }
        } catch (error) {
            console.error("Update play failed:", error);
            throw error;
        }
    }
};
