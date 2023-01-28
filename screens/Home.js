import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PostScreen from '../screens/mainScreen/PostsScreen';
import CreatePostsScreen from '../screens/mainScreen/CreatePostsScreen';
import ProfileScreen from '../screens/mainScreen/ProfileScreen';

const MainTab = createBottomTabNavigator();

export default function Home() {
    const navigation = useNavigation();
    
    return (
        <MainTab.Navigator
            screenOptions={styles.tabBar}
        >
            <MainTab.Screen
                name="Posts"
                component={PostScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            ...styles.iconWrapper,
                            backgroundColor: focused ? "#FF6C00" : "#FFFFFF",
                        }}>
                            <Feather
                                name="grid"
                                size={24}
                                color={focused ? "#FFFFFF" : "#212121"}
                            />
                        </View>
                    ),
                    headerShown: false,
                }}
            />
            <MainTab.Screen
                name="CreatePosts"
                component={CreatePostsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            ...styles.iconWrapper,
                            backgroundColor: focused ? "#FF6C00" : "#FFFFFF",
                        }}>
                            <Feather
                                name="plus"
                                size={24}
                                color={focused ? "#FFFFFF" : "#212121"}
                            />
                        </View>
                    ),
                    tabBarStyle: { display: "none" },
                    headerTitle: "Створити публікацію",
                    headerLeft: () => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{ marginLeft: 16 }}
                            onPress={() => navigation.navigate("DefaultScreen")}
                        >
                            <Feather
                                name="arrow-left"
                                size={24}
                                color="#212121"
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <MainTab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            ...styles.iconWrapper,
                            backgroundColor: focused ? "#FF6C00" : "#FFFFFF",
                        }}>
                            <Feather
                                name="user"
                                size={24}
                                color={focused ? "#FFFFFF" : "#212121"}
                            />
                        </View>
                    ),
                }}
            />
        </MainTab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        tabBarShowLabel: false,
        tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0.5,
            borderTopColor: "rgba(0, 0, 0, 0.3)",
        },
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
    iconWrapper: {
        width: 70,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    }
});