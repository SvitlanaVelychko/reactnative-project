import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from "react-native";

export default function DefaultScreenPosts ({ route, navigation }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (route.params) {
            setPosts(prevState => [...prevState, route.params])
        }
    }, [route.params])

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
            <FlatList
                data={posts}
                keyExtractor={(item, indx) => indx.toString()}
                renderItem={({ item }) => (
                    <View style={{ marginTop: 32 }}>
                        <Image
                            source={{ uri: item.photo }}
                            style={{ width: "100%", height: 240, borderRadius: 8 }}
                        />
                        <Text style={styles.photoTitleText}>{item.photoTitle}</Text>
                        <View style={styles.postInfoWrapper}>
                            <View style={styles.commentsWrapper}>
                                <TouchableOpacity
                                    style={{ marginRight: 6 }}
                                    onPress={()=> navigation.navigate("Comments", {photo: item.photo})}
                                >
                                    <Feather name="message-circle" size={24} color={"#BDBDBD"} />
                                </TouchableOpacity>
                                <Text>{ item.comments || 0 }</Text>
                            </View>
                            <View style={styles.locationWrapper}>
                                <TouchableOpacity
                                    style={{ marginRight: 4 }}
                                        onPress={() => navigation.navigate("Map", {
                                            location: item.location,
                                            title: item.locationName,
                                    })}
                                >
                                    <Feather name="map-pin" size={24} color={"#BDBDBD"} />
                                </TouchableOpacity>
                                <Text style={styles.locationNameText}>{ item.locationName }</Text>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 32,
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
    photoTitleText: {
        marginVertical: 8,
        fontFamily: "Roboto-Medium",
        fontSize: 16,
        lineHeight: 19,
        color: "#212121",
    },
    postInfoWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    commentsWrapper: {
        flexDirection: "row",
    },
    locationWrapper: {
        flexDirection: "row",
    },
    locationNameText: {
        textDecorationLine: "underline",
    },
});