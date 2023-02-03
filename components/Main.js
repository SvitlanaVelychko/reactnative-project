import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import useRoute from '../router';
import { auth } from "../firebase/confige";
import { authStateChangeUser} from "../redux/auth/authOperations";


export default function Main() {
    const { stateChange } = useSelector((state) => state.auth);
    dispatch = useDispatch();

    useEffect(() => {
        dispatch(authStateChangeUser());
    }, []);

    const routing = useRoute(stateChange);
    
    return (
        <NavigationContainer>
            {routing}
        </NavigationContainer>
    );
};