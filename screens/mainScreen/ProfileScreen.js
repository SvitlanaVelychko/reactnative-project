import React from "react";
import {
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Image,
    Text,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/bg.jpg")}
                style={styles.image}
            >
                <View style={styles.profileWrapper}>
                    <View style={styles.userAvatar}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.addBtn}>
                        <Image source={require("../../assets/images/add.png")} />
                    </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.userLogout}>
                            <Feather
                                name="log-out"
                                size={24}
                                color="#BDBDBD"
                            />
                    </TouchableOpacity>
                    <Text style={styles.userName}>Name</Text>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "flex-start",
    },
    profileWrapper: {
        flex: 1,
        position: "relative",
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: 105,
    },
    userAvatar: {
        position: "absolute",
        top: -60,
        alignSelf: "center",
        width: 120,
        height: 120,
        borderRadius: 16,
        backgroundColor: "#F6F6F6",
    },
    addBtn: {
        position: "absolute",
        bottom: 15,
        right: -12.5,
        transform: [{rotate: '45deg'}],
    },
    userLogout: {
        position: "absolute",
        top: 25,
        right: 16,
    },
    userName: { 
        textAlign: "center",
        marginTop: 92,
        fontFamily: "Roboto-Medium",
        fontSize: 30,
        lineHeight: 35,
        color: "#212121",
    },
});