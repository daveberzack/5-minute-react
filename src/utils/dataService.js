import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, collection, setDoc, getDoc, updateDoc, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let today = "";
let userCredential = {};

export const dataService = {

    init: function(todayString){
        today = todayString;
    },

    checkAutoLogin: function(setUserData){
        console.log("auto");
        // Set persistence to local storage to ensure user stays logged in
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                console.log("Persistence set to browserLocalPersistence");
            })
            .catch((error) => {
                console.error("Error setting persistence:", error);
            });
            
        const unsubscribe = auth.onAuthStateChanged(async (initialUserCredential) => {
            userCredential = initialUserCredential;
            if (initialUserCredential) {
                console.log("User is signed in:", initialUserCredential.uid);
                const newUserData = await this.loadData();
                setUserData(newUserData);
                console.log("auto newUserData", newUserData);
            } else {
                console.log("No user is signed in");
                setUserData(null);
            }
        });
        return () => unsubscribe();
    },

    signInWithGoogle: async function(){
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    },
    
    signOutUser: async function(){
        await signOut(auth);
    },

    signUpWithEmail: async function(email, password, username, character, color){
        const existingUser = await this.findUserByUsername(username);
        if (existingUser) {
            throw(new Error("username exists"));
        }
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        const userRef = doc(db, 'users', userCredential.user.uid); // Reference to the user's document
        await setDoc(userRef, {
            username: username,
            character: character,
            color: color,
            favorites: [],
            friendIds: [],
            preferences: {
                showOther: true
            }
        });

        return this.loadData()
    },
      
    signInWithEmail: async function(email, password){
        await setPersistence(auth, browserLocalPersistence);
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        return this.loadData()
    },

    findUserByUsername: async function(username) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            return { id: userDoc.id, ...userDoc.data() };
          } else {
            return null;
        }
    },

    loadData: async function(){
        const thisUser = auth.currentUser || userCredential?.user;
        let newUserData = null;
      
        if (db && thisUser?.uid){
            const userRef = doc(db, "users", thisUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                newUserData = userSnap.data();
            }
            
            const todayRef = doc(db, "users", thisUser.uid, "plays", today);
            const todaySnapshot = await getDoc(todayRef);
            newUserData.todayPlays = todaySnapshot.data() || [];

            console.log("newUserData before",newUserData);
            const friendIds = newUserData?.friendIds || [];
            newUserData.friends = [];

            for (let friendId of friendIds) {
                const friendRef = doc(db, "users", friendId);
                const friendSnap = await getDoc(friendRef);
                if (friendSnap.exists()) {
                    const friendData = friendSnap.data();
                    newUserData.friends.push({
                        id: friendId,
                        username: friendData.username || '',
                    });
                }
            }
            console.log("after",newUserData);

        }
        return newUserData;
    },

    setPreferences: async function (newPreferences){
        const userCredential = auth.currentUser;
        if (!userCredential) throw new Error("User Not Found");

        const userDocRef = doc(db, "users", userCredential.uid);
        await updateDoc(userDocRef, { preferences: newPreferences });
    },

    setFavorites: async function(newFavorites){
        const userCredential = auth.currentUser;
        if (!userCredential) throw new Error("User Not Found");

        const userDocRef = doc(db, "users", userCredential.uid);
        await updateDoc(userDocRef, { favorites: newFavorites });
    },

    setFriends: async function(newFriendIds){
        console.log("setFriends", newFriendIds);
        const userCredential = auth.currentUser;
        if (!userCredential) throw new Error("User Not Found");

        const userDocRef = doc(db, "users", userCredential.uid);
        await updateDoc(userDocRef, { friendIds: newFriendIds });
    },

    updatePlay: async function(gameId, score, message) {
        const userCredential = auth.currentUser;
        if (!userCredential) throw new Error("User Not Found");

        // const userDocRef = doc(db, "users", userCredential.uid);
        // await updateDoc(userDocRef, { favorites: newFavorites });
        const playDocRef = doc(db, "users", userCredential.uid, "plays", today);
        await updateDoc(playDocRef, {
            [`${gameId}.score`]: score,
            [`${gameId}.message`]: message,
        });
        
    }
}
