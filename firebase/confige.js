import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAX9bMEwesiLI0GIc9JqctdpxwMjr0yCp8",
    authDomain: "reactnative-project-2ff87.firebaseapp.com",
    projectId: "reactnative-project-2ff87",
    storageBucket: "reactnative-project-2ff87.appspot.com",
    messagingSenderId: "281282596940",
    appId: "1:281282596940:web:20ccc3da0b4369b48fe4e9"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const app = initializeApp(firebaseConfig);

export { app, firebase };
export const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

