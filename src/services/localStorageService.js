/**
 * Local Storage Service for managing all localStorage operations
 * Provides centralized, error-handled access to localStorage
 * Supports favorites, custom links, settings, and auth tokens
 */

const FAVORITES_KEY = 'glg_favorites';
const CUSTOM_LINKS_KEY = 'customLinks';
const DEFAULT_TAB_KEY = 'defaultTab';
const FAVORITE_ORDER_KEY = 'favoriteOrder';
const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const localStorageService = {
    /**
     * Get favorites from localStorage
     * @returns {Object} { favorites: number[], lastModified: string }
     */
    getFavorites() {
        try {
            const stored = localStorage.getItem(FAVORITES_KEY);
            if (!stored) {
                return { favorites: [], lastModified: null };
            }
            
            const parsed = JSON.parse(stored);
            
            // Handle legacy format (just array of favorites)
            if (Array.isArray(parsed)) {
                return {
                    favorites: parsed.map(id => typeof id === 'string' ? parseInt(id, 10) : id).filter(id => !isNaN(id)),
                    lastModified: null
                };
            }
            
            // New format with timestamp - ensure IDs are numbers
            const favorites = (parsed.favorites || []).map(id => typeof id === 'string' ? parseInt(id, 10) : id).filter(id => !isNaN(id));
            return {
                favorites,
                lastModified: parsed.lastModified || null
            };
        } catch (error) {
            console.error('Error reading favorites from localStorage:', error);
            return { favorites: [], lastModified: null };
        }
    },

    /**
     * Set favorites in localStorage with current timestamp
     * @param {number[]} favorites - Array of game IDs
     */
    setFavorites(favorites) {
        try {
            // Ensure all favorites are numbers
            const numericFavorites = (favorites || []).map(id => typeof id === 'string' ? parseInt(id, 10) : id).filter(id => !isNaN(id));
            const data = {
                favorites: numericFavorites,
                lastModified: new Date().toISOString()
            };
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(data));
            return data.lastModified;
        } catch (error) {
            console.error('Error saving favorites to localStorage:', error);
            throw error;
        }
    },

    /**
     * Add a favorite game ID
     * @param {number} gameId - Game ID to add
     * @returns {string} timestamp of the change
     */
    addFavorite(gameId) {
        // Ensure gameId is a number
        const numericGameId = typeof gameId === 'string' ? parseInt(gameId, 10) : gameId;
        if (isNaN(numericGameId)) {
            console.error('Invalid gameId provided to addFavorite:', gameId);
            return this.getFavorites().lastModified;
        }
        
        const { favorites } = this.getFavorites();
        if (!favorites.includes(numericGameId)) {
            favorites.push(numericGameId);
            return this.setFavorites(favorites);
        }
        return this.getFavorites().lastModified;
    },

    /**
     * Remove a favorite game ID
     * @param {number} gameId - Game ID to remove
     * @returns {string} timestamp of the change
     */
    removeFavorite(gameId) {
        // Ensure gameId is a number
        const numericGameId = typeof gameId === 'string' ? parseInt(gameId, 10) : gameId;
        if (isNaN(numericGameId)) {
            console.error('Invalid gameId provided to removeFavorite:', gameId);
            return this.getFavorites().lastModified;
        }
        
        const { favorites } = this.getFavorites();
        const newFavorites = favorites.filter(id => id !== numericGameId);
        if (newFavorites.length !== favorites.length) {
            return this.setFavorites(newFavorites);
        }
        return this.getFavorites().lastModified;
    },

    /**
     * Check if a game is favorited
     * @param {number} gameId - Game ID to check
     * @returns {boolean}
     */
    isFavorite(gameId) {
        // Ensure gameId is a number
        const numericGameId = typeof gameId === 'string' ? parseInt(gameId, 10) : gameId;
        if (isNaN(numericGameId)) {
            throw new Error(`Invalid gameId: ${gameId} must be a valid number`);
        }
        
        const { favorites } = this.getFavorites();
        return favorites.includes(numericGameId);
    },

    /**
     * Clear all favorites
     */
    clearFavorites() {
        try {
            localStorage.removeItem(FAVORITES_KEY);
        } catch (error) {
            console.error('Error clearing favorites from localStorage:', error);
        }
    },

    // ===== CUSTOM LINKS MANAGEMENT =====
    
    /**
     * Get custom links from localStorage
     * @returns {Array} Array of custom link objects
     */
    getCustomLinks() {
        try {
            const stored = localStorage.getItem(CUSTOM_LINKS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error reading custom links from localStorage:', error);
            return [];
        }
    },

    /**
     * Set custom links in localStorage
     * @param {Array} customLinks - Array of custom link objects
     */
    setCustomLinks(customLinks) {
        try {
            localStorage.setItem(CUSTOM_LINKS_KEY, JSON.stringify(customLinks || []));
        } catch (error) {
            console.error('Error saving custom links to localStorage:', error);
            throw error;
        }
    },

    /**
     * Add a custom link
     * @param {Object} customLink - Custom link object
     */
    addCustomLink(customLink) {
        const existingLinks = this.getCustomLinks();
        const updatedLinks = [...existingLinks, customLink];
        this.setCustomLinks(updatedLinks);
        
        // Trigger custom event for same-tab updates
        window.dispatchEvent(new Event('customLinksUpdated'));
    },

    /**
     * Remove a custom link by ID
     * @param {string} linkId - ID of the custom link to remove
     */
    removeCustomLink(linkId) {
        const existingLinks = this.getCustomLinks();
        const updatedLinks = existingLinks.filter(link => link.id !== linkId);
        this.setCustomLinks(updatedLinks);
        
        // Trigger custom event for same-tab updates
        window.dispatchEvent(new Event('customLinksUpdated'));
    },

    // ===== SETTINGS MANAGEMENT =====
    
    /**
     * Get default tab setting
     * @returns {string} Default tab name
     */
    getDefaultTab() {
        try {
            return localStorage.getItem(DEFAULT_TAB_KEY) || 'all';
        } catch (error) {
            console.error('Error reading default tab from localStorage:', error);
            return 'all';
        }
    },

    /**
     * Set default tab setting
     * @param {string} tab - Tab name to set as default
     */
    setDefaultTab(tab) {
        try {
            localStorage.setItem(DEFAULT_TAB_KEY, tab);
        } catch (error) {
            console.error('Error saving default tab to localStorage:', error);
            throw error;
        }
    },

    /**
     * Get favorite order from localStorage
     * @returns {Array} Array of favorite IDs in order
     */
    getFavoriteOrder() {
        try {
            const stored = localStorage.getItem(FAVORITE_ORDER_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error reading favorite order from localStorage:', error);
            return [];
        }
    },

    /**
     * Set favorite order in localStorage
     * @param {Array} order - Array of favorite IDs in order
     */
    setFavoriteOrder(order) {
        try {
            localStorage.setItem(FAVORITE_ORDER_KEY, JSON.stringify(order || []));
        } catch (error) {
            console.error('Error saving favorite order to localStorage:', error);
            throw error;
        }
    },

    // ===== AUTH TOKEN MANAGEMENT =====
    
    /**
     * Get auth token
     * @returns {string|null} Auth token or null
     */
    getAuthToken() {
        try {
            return localStorage.getItem(AUTH_TOKEN_KEY);
        } catch (error) {
            console.error('Error reading auth token from localStorage:', error);
            return null;
        }
    },

    /**
     * Get refresh token
     * @returns {string|null} Refresh token or null
     */
    getRefreshToken() {
        try {
            return localStorage.getItem(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error('Error reading refresh token from localStorage:', error);
            return null;
        }
    },

    /**
     * Set auth tokens
     * @param {string} token - Auth token
     * @param {string} refreshToken - Refresh token
     */
    setAuthTokens(token, refreshToken) {
        try {
            localStorage.setItem(AUTH_TOKEN_KEY, token);
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        } catch (error) {
            console.error('Error saving auth tokens to localStorage:', error);
            throw error;
        }
    },

    /**
     * Clear auth tokens
     */
    clearAuthTokens() {
        try {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error('Error clearing auth tokens from localStorage:', error);
        }
    },
};