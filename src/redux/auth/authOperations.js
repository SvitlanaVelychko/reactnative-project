import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
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
    } catch (error) {
        console.log(error.message);
    }
};

export const authSignInUser = ({ email, password }) => async (
    dispatch, getState) => {
    try {
        const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log(error.message);
    }
};


export const authSignOutUser = () => async (dispatch, getState) => { 
    try {
        await signOut(auth);

        dispatch(authSignOut());
    } catch (error) {
        console.log(error.message);
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
        console.log(error.message);
    }
};