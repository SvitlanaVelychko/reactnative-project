import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { Alert } from "react-native";
import { auth } from "../../firebase/confige";
import { authSlice } from "./authReducer";

const { updateUserProfile, authStateChange, authSignOut, updateAvatar } = authSlice.actions;

export const authSignUpUser = ({ name, email, password, avatar}) => async (
    dispatch,
    getState
) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: avatar,
        });

        const { uid, displayName, photoURL } = await auth.currentUser;
        

        dispatch(
            updateUserProfile({
                userId: uid,
                name: displayName,
                email,
                avatar: photoURL,
            }));
        Alert.alert(`Wellcome, ${name}`);
    } catch (error) {
        const errorCode = error.code;

        if (errorCode === 'auth/weak-password') {
            Alert.alert('The password is too weak! Please, try another password!');
        }
        if (errorCode === 'auth/email-already-in-use') {
            Alert.alert('Sorry, an account with such email already exists! Please login!');
        }
        if (errorCode === 'auth/invalid-email') {
            Alert.alert('Email is not valid! Try another email!');
        } else {
            Alert.alert(error.message);
        }
        console.log(error);
    }
};

export const authSignInUser = ({ email, password }) => async (
    dispatch, getState) => {
    try {
        const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        const errorCode = error.code;

        if (errorCode === 'auth/wrong-password') {
            Alert.alert('Password is invalid! Please try again!');
        }
        if (errorCode === 'auth/user-not-found') {
            Alert.alert('User with such email was not found!');
        }
        if (errorCode === 'auth/invalid-email') {
            Alert.alert('Email is not valid! Please try another email!');
        } else {
            Alert.alert(error.message);
        }
        console.log(error);
    }
};


export const authSignOutUser = () => async (dispatch, getState) => { 
    try {
        await signOut(auth);

        dispatch(authSignOut());
    } catch (error) {
        Alert.alert(error.message);
        console.log(error);
    }
};


export const authStateChangeUser = () => async (dispatch, getState) => {
    await onAuthStateChanged(auth, (user) => {
        if (user) {
            const { uid, displayName, email, photoURL } = user;
            const userUpdateProfile = {
                userId: uid,
                name: displayName,
                email: email, 
                avatar: photoURL,
            };

            dispatch(authStateChange({ stateChange: true }));
            dispatch(updateUserProfile(userUpdateProfile));
        }
    });
};

export const updateUserAvatar = (avatar) => async (dispatch, getState) => {
    try {
        await updateProfile(auth.currentUser, {
            photoURL: avatar,
        });

        const { photoURL } = auth.currentUser;
        dispatch(updateAvatar({ avatar: photoURL }));
    } catch (error) {
        Alert.alert('Something wrong! Please, try again!');
        console.log(error);
    }
};