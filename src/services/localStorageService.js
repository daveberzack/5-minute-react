/**
 * Local Storage Service for managing user favorites
 * Supports both authenticated and unauthenticated users
 * Uses timestamps for conflict resolution during sync
 */

const FAVORITES_KEY = 'glg_favorites';

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

    /**
     * Sync favorites with server data based on timestamps
     * @param {number[]} serverFavorites - Favorites from server
     * @param {string} serverLastModified - Server's last modified timestamp
     * @returns {Object} { favorites: number[], source: 'local'|'server'|'merged', timestamp: string }
     */
    syncFavorites(serverFavorites, serverLastModified) {
        const local = this.getFavorites();
        
        // Ensure server favorites are numbers
        const numericServerFavorites = (serverFavorites || []).map(id => typeof id === 'string' ? parseInt(id, 10) : id).filter(id => !isNaN(id));
        
        // If no local data, use server data
        if (!local.lastModified) {
            if (numericServerFavorites.length > 0) {
                this.setFavorites(numericServerFavorites);
                return {
                    favorites: numericServerFavorites,
                    source: 'server',
                    timestamp: serverLastModified
                };
            }
            return {
                favorites: local.favorites,
                source: 'local',
                timestamp: local.lastModified
            };
        }

        // If no server data, keep local data
        if (!serverLastModified) {
            return {
                favorites: local.favorites,
                source: 'local',
                timestamp: local.lastModified
            };
        }

        // Compare timestamps - most recent wins
        const localTime = new Date(local.lastModified);
        const serverTime = new Date(serverLastModified);

        if (serverTime > localTime) {
            // Server is newer, update local
            this.setFavorites(numericServerFavorites);
            return {
                favorites: numericServerFavorites,
                source: 'server',
                timestamp: serverLastModified
            };
        } else {
            // Local is newer or same, keep local
            return {
                favorites: local.favorites,
                source: 'local',
                timestamp: local.lastModified
            };
        }
    }
};