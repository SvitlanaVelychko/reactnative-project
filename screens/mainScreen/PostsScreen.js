import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PostsScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.userWrapper}>
                <View style={styles.userAvatar}>
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userNameText}>Name</Text>
                    <Text style={styles.userEmailText}>Email</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 32,
    },
    userWrapper: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    userAvatar: {
        width: 60,
        height: 60,
        backgroundColor: "#F6F6F6",
        borderRadius: 16,
    },
    userInfo: {
        flexDirection: "column",
        marginLeft: 8,
        justifyContent: "center",
    },
    userNameText: {
        fontFamily: "Roboto-Bold",
        fontSize: 13,
        lineHeight: 15,
        color: "#212121",
    },
    userEmailText: {
        fontFamily: "Roboto-Regular",
        fontSize: 11,
        lineHeight: 13,
        color: "rgba(33, 33, 33, 0.8)",
    },
});