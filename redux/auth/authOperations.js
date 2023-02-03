import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { auth } from "../../firebase/confige";
import { authSlice } from "./authReducer";

const { updateUserProfile, authStateChange, authSignOut } = authSlice.actions;

export const authSignUpUser = ({ email, password, name }) => async (
    dispatch,
    getState
) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(auth.currentUser, {
            displayName: name,
        });

        const { uid, displayName } = await auth.currentUser;

        dispatch(
            updateUserProfile({ 
                userId: uid,
                name: displayName,
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
    await signOut(auth);

    dispatch(authSignOut());
};


export const authStateChangeUser = () => async (dispatch, getState) => {
    await onAuthStateChanged(auth, (user) => {
        if (user) {
            const userUpdateProfile = {
                userId: user.uid,
                name: user.displayName,
            };

            dispatch(authStateChange({ stateChange: true }));
            dispatch(updateUserProfile(userUpdateProfile));
        }
    });
};