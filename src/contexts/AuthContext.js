import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as authLogin, register as authRegister, logout as authLogout, checkAutoLogin } from '../services/authService';
import { addFriend, removeFriend, addFavorite, removeFavorite, updatePlay, getUserGamePlays, updateGamePlay, getGamePlayForToday, hasScoreForToday } from '../services/gameService';
import { localStorageService } from '../services/localStorageService';
import * as gameActivityService from '../services/gameActivityService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [localFavorites, setLocalFavorites] = useState([]);
    const [gamesPlayedToday, setGamesPlayedToday] = useState([]);

    useEffect(() => {
        // Always load favorites from localStorage first for immediate UI
        const { favorites } = localStorageService.getFavorites();
        setLocalFavorites(favorites);

        // Initialize daily game activity tracking
        const playedToday = gameActivityService.initializeDailyTracking();
        setGamesPlayedToday(playedToday);

        // Then check for authenticated user and sync
        checkAutoLogin()
            .then((user) => {
                if (user) {
                    setUser(user);
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error during auto-login:', error);
                setIsLoading(false);
            });
    }, []);

    const login = async (username, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const authenticatedUser = await authLogin(username, password);
            return authenticatedUser;
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
            const authenticatedUser = await authRegister(username, password);
            return authenticatedUser;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await authLogout();
    };

    // User data management functions
    const addFriendHandler = async (username) => {
        try {
            const updatedUser = await addFriend(username);
            setUser(updatedUser);
            return updatedUser;
        } catch (error) {
            console.error("Error adding friend:", error);
            throw new Error(`Failed to add friend ${username}: ${error.message}`);
        }
    };

    const removeFriendHandler = async (friendId) => {
        try {
            const updatedUser = await removeFriend(friendId);
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

    const addFavoriteHandler = async (gameId) => {
        try {
            // Always update localStorage first (optimistic update)
            localStorageService.addFavorite(gameId);
            updateFavoriteState();

            // If user is authenticated, also update server
            if (user) {
                try {
                    const updatedUser = await addFavorite(gameId);
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

    const removeFavoriteHandler = async (gameId) => {
        try {
            // Always update localStorage first (optimistic update)
            localStorageService.removeFavorite(gameId);
            updateFavoriteState();

            // If user is authenticated, also update server
            if (user) {
                try {
                    const updatedUser = await removeFavorite(gameId);
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
            const updatedUser = await updatePlay(gameId, score, message);
            setUser(updatedUser);
        } catch (error) {
            console.error("Error updating play:", error);
        }
    };

    // Helper function to get current favorites (from user if authenticated, otherwise from localStorage)
    const getCurrentFavorites = () => {
        return user?.favorites || localFavorites;
    };

    // ===== GAME ACTIVITY FUNCTIONS =====
    
    const initializeDailyTracking = useCallback(() => {
        const playedToday = gameActivityService.initializeDailyTracking();
        setGamesPlayedToday(playedToday);
        return playedToday;
    }, []);

    const markGameAsPlayed = useCallback((gameId) => {
        const updatedGames = gameActivityService.markGameAsPlayed(gameId);
        setGamesPlayedToday(updatedGames);
        return updatedGames;
    }, []);

    const hasGameBeenPlayedToday = (gameId) => {
        return gameActivityService.hasGameBeenPlayedToday(gameId);
    };

    const handleGameLinkClick = (gameId, gameUrl, event = null) => {
        const success = gameActivityService.handleGameLinkClick(gameId, gameUrl, event);
        // Update local state to reflect the change immediately
        setGamesPlayedToday(prev => {
            if (!prev.includes(gameId)) {
                return [...prev, gameId];
            }
            return prev;
        });
        return success;
    };

    const checkForRecentGameVisit = () => {
        return gameActivityService.checkForRecentGameVisit();
    };

    const clearRecentGameVisit = () => {
        return gameActivityService.clearRecentGameVisit();
    };

    // ===== ADDITIONAL GAME SERVICE FUNCTIONS =====

    const getUserGamePlays = async () => {
        try {
            return await getUserGamePlays();
        } catch (error) {
            console.error("Error getting user game plays:", error);
            throw error;
        }
    };

    const updateGamePlay = async (playData) => {
        try {
            const updatedUser = await updateGamePlay(playData);
            setUser(updatedUser);
            return updatedUser;
        } catch (error) {
            console.error("Error updating game play:", error);
            throw error;
        }
    };

    const getGamePlayForToday = async (gameId, date = null) => {
        try {
            return await getGamePlayForToday(gameId, date);
        } catch (error) {
            console.error("Error getting game play for today:", error);
            throw error;
        }
    };

    const hasScoreForToday = async (gameId, date = null) => {
        try {
            return await hasScoreForToday(gameId, date);
        } catch (error) {
            console.error("Error checking score for today:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            // Auth state
            user,
            isLoading,
            error,
            isAuthenticated: !!user,
            
            // Auth functions
            login,
            register,
            logout,
            
            // Friend functions
            addFriend: addFriendHandler,
            removeFriend: removeFriendHandler,
            
            // Favorites functions
            addFavorite: addFavoriteHandler,
            removeFavorite: removeFavoriteHandler,
            favorites: getCurrentFavorites(),
            localFavorites,
            
            // Game activity state
            gamesPlayedToday,
            
            // Game activity functions
            initializeDailyTracking,
            markGameAsPlayed,
            hasGameBeenPlayedToday,
            handleGameLinkClick,
            checkForRecentGameVisit,
            clearRecentGameVisit,
            
            // Game service functions
            getUserGamePlays,
            updateGamePlay,
            getGamePlayForToday,
            hasScoreForToday,
            updatePlay // Keep legacy function for backward compatibility
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
