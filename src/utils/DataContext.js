
import React, { createContext, useContext, useEffect, useState } from 'react';
import { games } from '../games';
import { dataService } from './dataService';


const DataContext = createContext();

export const DataProvider = ({ children }) => {

    const today = new Date().toISOString().split("T")[0];
    dataService.init(today);

    const [userData, setUserData] = useState(null);
    const [gameIdPlayEditing, setGameIdPlayEditing] = useState(null);
  
    // Check user authentication state on load
    useEffect(() => {
        return dataService.checkAutoLogin(setUserData);
    }, []);

    const signInWithGoogle = async (onComplete) => {
        try {
            await dataService.signInWithGoogle();
            onComplete();
        }
        catch  (error) {
            console.error("Error signing in with Google:", error);
        }
    };
      
    const signOutUser = async () => {
        try {
            await dataService.signOutUser();
            setUserData(null);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };
      
    const signUpWithEmail = async (email, password, username, character, color, onComplete) => {
        try {
            const newUserData = await dataService.signUpWithEmail(email, password, username, character, color);
            setUserData(newUserData);
            onComplete();
        } catch (error) {
          console.error("Error signing up:", error.message);
        }
    };
      
    const signInWithEmail = async (email, password, onComplete) => {
        try {
            const newUserData = await dataService.signInWithEmail(email, password);
            console.log("sign in",newUserData)
            setUserData(newUserData);
            onComplete();
        } catch (error) {
            console.error("Error signing in:", error.message);
        }
    };
      
    const setPreferences = async (newPreferences) => {
        try {
            await dataService.setPreferences(newPreferences);
            const newUserData = { ...userData, preferences: newPreferences };
            setUserData(newUserData);
        } catch (error) {
            console.error("Error updating preferences:", error);
        }
    }

    const setFavorites = async (newFavorites) => {
        try {
            await dataService.setFavorites(newFavorites);
            const newUserData = { ...userData, favorites: newFavorites };
            setUserData(newUserData);
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    }

    function addFavorite(id) {
        const newFavorites = [...userData.favorites];
        newFavorites.push(id);
        setFavorites(newFavorites);
    }

    function removeFavorite(id) {
        const newFavorites = userData.favorites.filter(item => item != id);
        setFavorites(newFavorites);
    }

    const setFriends = async (newFriendIds) => {
        try {
            await dataService.setFriends(newFriendIds);
            const newUserData = await dataService.loadData();
            console.log(newUserData);
            setUserData(newUserData);
        } catch (error) {
            console.error("Error updating friends:", error);
        }
    }

    async function addFriend(username) {
        const newFriendIds = userData.friends.map( f=> f.id );
        const newFriend = await dataService.findUserByUsername(username);
        if (newFriend){
            newFriendIds.push(newFriend.id);
            setFriends(newFriendIds);
            return true;
        }
        else return false;
    }

    async function removeFriend(id) {
        const newFriends = userData.friends.filter(item => item.id != id);
        console.log("remove:"+id, newFriends);
        const newFriendIds = newFriends.map( f=> f.id );
        setFriends(newFriendIds);
    }

    function setGameToEditPlay(id) {
        setGameIdPlayEditing(id);
    }

    async function updatePlay(score, message) {
        console.log("update play:"+score+" --- "+message);

        try {
            await dataService.updatePlay(gameIdPlayEditing, score, message);
            
            const newTodayPlays = {...userData.todayPlays};
            newTodayPlays[gameIdPlayEditing] = {score, message};
            console.log(newTodayPlays);
            const newUserData = { ...userData, todayPlays: newTodayPlays };
            setUserData(newUserData);
        } catch (error) {
            console.error("Error updating preferences:", error);
        }

        setGameIdPlayEditing(null);
    }

    async function cancelEditPlay() {
        setGameIdPlayEditing(null);
    }
  
    return (
        <DataContext.Provider value={{ 
            signInWithGoogle, 
            signOutUser, 
            signUpWithEmail, 
            signInWithEmail,
            games,
            userData,
            setPreferences,
            addFavorite,
            removeFavorite,
            addFriend,
            removeFriend,
            setGameToEditPlay,
            gameIdPlayEditing,
            updatePlay,
            cancelEditPlay
        }}>
            {children}
        </DataContext.Provider>
    );
  };

  export const useData = () => useContext(DataContext);