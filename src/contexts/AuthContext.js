import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as authLogin, register as authRegister, logout as authLogout, checkAutoLogin } from '../services/authService';
import { getFriendsDashboard, addFriend, removeFriend, updateGamePlay } from '../services/gameService';
import { localStorageService } from '../services/localStorageService';
import * as gameActivityService from '../services/gameActivityService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [localFavorites, setLocalFavorites] = useState([]);
    const [gamesPlayedToday, setGamesPlayedToday] = useState([]);
    
    // Friends data state (only loaded when Friends tab is visited)
    const [friendsData, setFriendsData] = useState(null);
    const [friendsLoading, setFriendsLoading] = useState(false);
    const [friendsError, setFriendsError] = useState(null);

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

    // Friends data management functions
    const loadFriendsData = async () => {
        if (friendsData || friendsLoading) return friendsData; // Already loaded or loading
        
        setFriendsLoading(true);
        setFriendsError(null);
        try {
            const data = await getFriendsDashboard();
            setFriendsData(data);
            return data;
        } catch (error) {
            console.error("Error loading friends data:", error);
            setFriendsError(error.message);
            throw error;
        } finally {
            setFriendsLoading(false);
        }
    };

    const addFriendHandler = async (username) => {
        try {
            // Optimistic update
            if (friendsData) {
                const newFriend = { id: Date.now(), username }; // Temporary ID
                setFriendsData(prev => ({
                    ...prev,
                    friends: [...prev.friends, newFriend]
                }));
            }
            
            await addFriend(username);
            
            // Refresh friends data to get correct ID
            if (friendsData) {
                await loadFriendsData();
            }
        } catch (error) {
            // Revert optimistic update on error
            if (friendsData) {
                setFriendsData(prev => ({
                    ...prev,
                    friends: prev.friends.filter(f => f.username !== username)
                }));
            }
            console.error("Error adding friend:", error);
            throw new Error(`Failed to add friend ${username}: ${error.message}`);
        }
    };

    const removeFriendHandler = async (friendId) => {
        try {
            // Optimistic update
            if (friendsData) {
                setFriendsData(prev => ({
                    ...prev,
                    friends: prev.friends.filter(f => f.id !== friendId)
                }));
            }
            
            await removeFriend(friendId);
        } catch (error) {
            // Refresh data on error to revert
            if (friendsData) {
                await loadFriendsData();
            }
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
        } catch (error) {
            console.error("Error removing favorite:", error);
            updateFavoriteState(); // Revert to current localStorage state
        }
    };

    const updatePlayHandler = async (gameId, score, message) => {
        try {
            // Optimistic update to friends data if loaded
            if (friendsData) {
                setFriendsData(prev => ({
                    ...prev,
                    today_plays: {
                        ...prev.today_plays,
                        [gameId]: { score, message }
                    }
                }));
            }
            
            await updateGamePlay({
                game_id: gameId,
                score: score,
                message: message || ''
            });
        } catch (error) {
            // Revert optimistic update on error
            if (friendsData) {
                const originalPlay = friendsData.today_plays[gameId];
                if (originalPlay) {
                    setFriendsData(prev => ({
                        ...prev,
                        today_plays: {
                            ...prev.today_plays,
                            [gameId]: originalPlay
                        }
                    }));
                } else {
                    setFriendsData(prev => {
                        const newPlays = { ...prev.today_plays };
                        delete newPlays[gameId];
                        return {
                            ...prev,
                            today_plays: newPlays
                        };
                    });
                }
            }
            console.error("Error updating play:", error);
            throw error;
        }
    };

    // Helper function to get current favorites (from user if authenticated, otherwise from localStorage)
    const getCurrentFavorites = () => {
        return localFavorites;
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

    // ===== SIMPLIFIED GAME FUNCTIONS =====

    const hasScoreForToday = (gameId) => {
        if (!friendsData) return false;
        const play = friendsData.today_plays[gameId];
        return play && play.score !== null && play.score !== '';
    };

    const getGamePlayForToday = (gameId) => {
        if (!friendsData) return null;
        return friendsData.today_plays[gameId] || null;
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
            
            // Friends data state
            friendsData,
            friendsLoading,
            friendsError,
            loadFriendsData,
            
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
            updatePlay: updatePlayHandler,
            getGamePlayForToday,
            hasScoreForToday
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
