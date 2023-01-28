import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Feather } from "@expo/vector-icons";
import DefaultScreenPosts from "../nestedScreens/DefaultScreenPosts";
import CommentsScreen from "../nestedScreens/CommentsScreen";
import MapScreen from "../nestedScreens/MapScreen";

const NestedStack = createStackNavigator();

export default function PostsScreen({navigation}) {
    return (
        <NestedStack.Navigator screenOptions={styles.headerBar}>
            <NestedStack.Screen
                options={{
                    headerTitle: "Публікації",
                    headerRight: () => (
                        <TouchableOpacity style={{ marginRight: 16 }}>
                            <Feather
                                name="log-out"
                                size={24}
                                color="#BDBDBD"
                            />
                        </TouchableOpacity>
                    ),
                }}
                name="DefaultScreen"
                component={DefaultScreenPosts}
            />
            <NestedStack.Screen
                options={{
                    headerTitle: "Коментарі",
                }}
                name="Comments"
                component={CommentsScreen}
            />
            <NestedStack.Screen
                options={{
                    headerTitle: "Мапа",
                }}
                name="Map"
                component={MapScreen}
            />
        </NestedStack.Navigator>
    );
};

const styles = StyleSheet.create({
    headerBar: {
        headerTitleAlign: "center",
        headerStyle: {
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 0.5,
            borderBottomColor: "rgba(0, 0, 0, 0.3)",
        },
        headerTitleStyle: {
            fontFamily: "Roboto-Medium",
            fontSize: 17,
            lineHeight: 22,
            color: "#212121",
        },
    },
});