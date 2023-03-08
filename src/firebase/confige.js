import { getApp, getApps, initializeApp } from "firebase/app";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence} from 'firebase/auth/react-native';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAX9bMEwesiLI0GIc9JqctdpxwMjr0yCp8",
    authDomain: "reactnative-project-2ff87.firebaseapp.com",
    projectId: "reactnative-project-2ff87",
    storageBucket: "reactnative-project-2ff87.appspot.com",
    messagingSenderId: "281282596940",
    appId: "1:281282596940:web:20ccc3da0b4369b48fe4e9",
    measurementId: "G-1PVKPD4H7F"
};

let app;
let auth;

if (getApps().length < 1) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
    });
} else {
    app = getApp();
    auth = getAuth();
}

export { app, auth };
export const storage = getStorage(app);
export const db = getFirestore(app);