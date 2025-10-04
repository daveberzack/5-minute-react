import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { localStorageService } from '../services/localStorageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [localFavorites, setLocalFavorites] = useState([]);

    useEffect(() => {
        // Always load favorites from localStorage first for immediate UI
        const { favorites } = localStorageService.getFavorites();
        setLocalFavorites(favorites);

        // Then check for authenticated user and sync
        authService.checkAutoLogin()
            .then(async (authenticatedUser) => {
                if (authenticatedUser) {
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
                    
                    // If local was newer, update server
                    if (syncResult.source === 'local' && syncResult.favorites.length !== authenticatedUser.favorites?.length) {
                        try {
                            // TODO: We'll need to add a bulk update API endpoint
                            console.log('Local favorites are newer, should sync to server:', syncResult.favorites);
                        } catch (error) {
                            console.error('Failed to sync local favorites to server:', error);
                        }
                    }
                    
                    setUser(updatedUser);
                    setLocalFavorites(syncResult.favorites);
                } else {
                    // No authenticated user, use localStorage favorites only
                    setUser(null);
                }
            })
            .catch(() => {
                setUser(null);
                // Keep localStorage favorites even if auth fails
            })
            .finally(() => setIsLoading(false));
    }, []);

    const login = async (username, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const authenticatedUser = await authService.login(username, password);
            
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
            
            setUser(updatedUser);
            setLocalFavorites(syncResult.favorites);
            
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
            
            // Sync favorites between localStorage and server (new users will have empty server favorites)
            const syncResult = localStorageService.syncFavorites(
                authenticatedUser.favorites || [],
                authenticatedUser.favoritesLastModified
            );
            
            // Update user object with synced favorites
            const updatedUser = {
                ...authenticatedUser,
                favorites: syncResult.favorites
            };
            
            setUser(updatedUser);
            setLocalFavorites(syncResult.favorites);
            
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
        setUser(null);
        // Keep localStorage favorites when logging out
        // This allows users to maintain their favorites across login sessions
        const { favorites } = localStorageService.getFavorites();
        setLocalFavorites(favorites);
    };

    // User data management functions
    const addFriend = async (username) => {
        try {
            const updatedUser = await userService.addFriend(username);
            setUser(updatedUser);
            return true;
        } catch (error) {
            console.error("Error adding friend:", error);
            return false;
        }
    };

    const removeFriend = async (friendId) => {
        try {
            const updatedUser = await userService.removeFriend(friendId);
            setUser(updatedUser);
        } catch (error) {
            console.error("Error removing friend:", error);
        }
    };

    const addFavorite = async (gameId) => {
        try {
            // Always update localStorage first (optimistic update)
            const timestamp = localStorageService.addFavorite(gameId);
            const { favorites } = localStorageService.getFavorites();
            setLocalFavorites(favorites);

            // If user is authenticated, also update server
            if (user) {
                try {
                    const updatedUser = await userService.addFavorite(gameId);
                    setUser(updatedUser);
                } catch (error) {
                    console.error("Error syncing favorite to server:", error);
                    // Keep localStorage change even if server fails
                    // TODO: Could implement a retry queue here for offline scenarios
                }
            }
        } catch (error) {
            console.error("Error adding favorite:", error);
            // If localStorage fails, try to revert the UI state
            try {
                const { favorites } = localStorageService.getFavorites();
                setLocalFavorites(favorites);
            } catch (revertError) {
                console.error("Failed to revert favorites state:", revertError);
            }
        }
    };

    const removeFavorite = async (gameId) => {
        try {
            // Always update localStorage first (optimistic update)
            const timestamp = localStorageService.removeFavorite(gameId);
            const { favorites } = localStorageService.getFavorites();
            setLocalFavorites(favorites);

            // If user is authenticated, also update server
            if (user) {
                try {
                    const updatedUser = await userService.removeFavorite(gameId);
                    setUser(updatedUser);
                } catch (error) {
                    console.error("Error syncing favorite removal to server:", error);
                    // Keep localStorage change even if server fails
                    // TODO: Could implement a retry queue here for offline scenarios
                }
            }
        } catch (error) {
            console.error("Error removing favorite:", error);
            // If localStorage fails, try to revert the UI state
            try {
                const { favorites } = localStorageService.getFavorites();
                setLocalFavorites(favorites);
            } catch (revertError) {
                console.error("Failed to revert favorites state:", revertError);
            }
        }
    };

    const updatePlay = async (gameId, score, message) => {
        try {
            const updatedUser = await userService.updatePlay(gameId, score, message);
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