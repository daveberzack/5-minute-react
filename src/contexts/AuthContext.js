import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { gameService } from '../services/gameService';
import { localStorageService } from '../services/localStorageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [localFavorites, setLocalFavorites] = useState([]);

    // Centralized function to sync favorites and update state
    const syncFavoritesAndUpdateState = (authenticatedUser) => {
        if (!authenticatedUser) {
            // No authenticated user, use localStorage favorites only
            const { favorites } = localStorageService.getFavorites();
            setLocalFavorites(favorites);
            setUser(null);
            return null;
        }

        // Sync favorites between localStorage and server
        const syncResult = localStorageService.syncFavorites(
            authenticatedUser.favorites,
            authenticatedUser.favoritesLastModified
        );
        
        // Update user object with synced favorites
        const updatedUser = {
            ...authenticatedUser,
            favorites: syncResult.favorites
        };
        
        // If local was newer, update server (TODO: implement bulk update API)
        if (syncResult.source === 'local' && syncResult.favorites.length !== authenticatedUser.favorites?.length) {
            console.log('Local favorites are newer, should sync to server:', syncResult.favorites);
        }
        
        setUser(updatedUser);
        setLocalFavorites(syncResult.favorites);
        return updatedUser;
    };

    useEffect(() => {
        // Always load favorites from localStorage first for immediate UI
        const { favorites } = localStorageService.getFavorites();
        setLocalFavorites(favorites);

        // Then check for authenticated user and sync
        authService.checkAutoLogin()
            .then(syncFavoritesAndUpdateState)
            .catch(() => syncFavoritesAndUpdateState(null))
            .finally(() => setIsLoading(false));
    }, []);

    const login = async (username, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const authenticatedUser = await authService.login(username, password);
            const updatedUser = syncFavoritesAndUpdateState(authenticatedUser);
            return updatedUser;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const authenticatedUser = await authService.register(username, password);
            const updatedUser = syncFavoritesAndUpdateState(authenticatedUser);
            return updatedUser;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await authService.logout();
        syncFavoritesAndUpdateState(null); // This will set user to null and update favorites from localStorage
    };

    // User data management functions
    const addFriend = async (username) => {
        try {
            const updatedUser = await gameService.addFriend(username);
            setUser(updatedUser);
            return updatedUser;
        } catch (error) {
            console.error("Error adding friend:", error);
            throw new Error(`Failed to add friend ${username}: ${error.message}`);
        }
    };

    const removeFriend = async (friendId) => {
        try {
            const updatedUser = await gameService.removeFriend(friendId);
            setUser(updatedUser);
        } catch (error) {
            console.error("Error removing friend:", error);
        }
    };

    // Simplified favorites management with consistent error handling
    const updateFavoriteState = () => {
        const { favorites } = localStorageService.getFavorites();
        setLocalFavorites(favorites);
    };

    const addFavorite = async (gameId) => {
        try {
            // Always update localStorage first (optimistic update)
            localStorageService.addFavorite(gameId);
            updateFavoriteState();

            // If user is authenticated, also update server
            if (user) {
                try {
                    const updatedUser = await gameService.addFavorite(gameId);
                    setUser(updatedUser);
                } catch (error) {
                    console.error("Error syncing favorite to server:", error);
                    // Keep localStorage change even if server fails
                }
            }
        } catch (error) {
            console.error("Error adding favorite:", error);
            updateFavoriteState(); // Revert to current localStorage state
        }
    };

    const removeFavorite = async (gameId) => {
        try {
            // Always update localStorage first (optimistic update)
            localStorageService.removeFavorite(gameId);
            updateFavoriteState();

            // If user is authenticated, also update server
            if (user) {
                try {
                    const updatedUser = await gameService.removeFavorite(gameId);
                    setUser(updatedUser);
                } catch (error) {
                    console.error("Error syncing favorite removal to server:", error);
                    // Keep localStorage change even if server fails
                }
            }
        } catch (error) {
            console.error("Error removing favorite:", error);
            updateFavoriteState(); // Revert to current localStorage state
        }
    };

    const updatePlay = async (gameId, score, message) => {
        try {
            const updatedUser = await gameService.updatePlay(gameId, score, message);
            setUser(updatedUser);
        } catch (error) {
            console.error("Error updating play:", error);
        }
    };

    // Helper function to get current favorites (from user if authenticated, otherwise from localStorage)
    const getCurrentFavorites = () => {
        return user?.favorites || localFavorites;
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            error,
            login,
            register,
            logout,
            isAuthenticated: !!user,
            addFriend,
            removeFriend,
            addFavorite,
            removeFavorite,
            updatePlay,
            favorites: getCurrentFavorites(),
            localFavorites
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};