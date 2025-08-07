import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gameIdPlayEditing, setGameIdPlayEditing] = useState(null);

    useEffect(() => {
        authService.checkAutoLogin()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const user = await authService.login(email, password);
            setUser(user);
            return user;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email, password, username, character, color) => {
        setIsLoading(true);
        setError(null);
        try {
            const user = await authService.register(email, password, username, character, color);
            setUser(user);
            return user;
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
            const updatedUser = await userService.addFavorite(gameId);
            setUser(updatedUser);
        } catch (error) {
            console.error("Error adding favorite:", error);
        }
    };

    const removeFavorite = async (gameId) => {
        try {
            const updatedUser = await userService.removeFavorite(gameId);
            setUser(updatedUser);
        } catch (error) {
            console.error("Error removing favorite:", error);
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


    const setGameToEditPlay = (gameId) => {
        setGameIdPlayEditing(gameId);
    };

    const cancelEditPlay = () => {
        setGameIdPlayEditing(null);
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
            setGameToEditPlay,
            gameIdPlayEditing,
            cancelEditPlay
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