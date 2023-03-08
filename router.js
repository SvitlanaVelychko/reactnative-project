import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from './src/screens/auth/RegistrationScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import Home from "./src/screens/Home";

const AuthStack = createStackNavigator();

export default function useRoute (isAuth) {
    if (!isAuth) {
        return (
            <AuthStack.Navigator initialRouteName="Register">
                <AuthStack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="Registration"
                    component={RegistrationScreen}
                />
                <AuthStack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="Login"
                    component={LoginScreen}
                />
            </AuthStack.Navigator>
        );
    } 
        return (
            <Home />
        );
};