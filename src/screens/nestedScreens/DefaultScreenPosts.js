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

import { db } from "../../firebase/confige";
import {
    collection,
    onSnapshot,
    doc,
    getDoc,
    updateDoc,
    arrayRemove,
    arrayUnion,
} from "firebase/firestore";
import { useSelector } from "react-redux";

export default function DefaultScreenPosts ({ navigation }) {
    const [posts, setPosts] = useState([]);

    const { userId } = useSelector((state) => state.auth);

    useEffect(() => {
        getAllPosts();
    }, []);

    const getAllPosts = async () => {
        try {
            const postsRef = collection(db, "posts");

            onSnapshot(postsRef, (data) => {
                setPosts(data.docs.map((doc)=> ({ ...doc.data(), id: doc.id })));
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    const toggleLikes = async (postId) => {
        try {
            const postRef = doc(db, "posts", postId);
            const result = await getDoc(postRef);
            const { likes } = result.data();

            if (likes && likes.includes(userId)) {
                await updateDoc(postRef, {
                    likes: arrayRemove(userId)
                });
            }
            else {
                await updateDoc(postRef, {
                    likes: arrayUnion(userId)
                });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 32 }}>
                        <View style={styles.userWrapper}>
                            <View style={styles.userAvatar}>
                                <Image source={{ uri: item.avatar }} style={{ width: 60, height: 60, borderRadius: 16 }} />
                            </View>
                            <View style={styles.userInfo}>
                                <Text style={styles.userNameText}>{item.name}</Text>
                                <Text style={styles.userEmailText}>{item.email}</Text>
                            </View>
                        </View>
                        <Image
                            source={{ uri: item.photo }}
                            style={{ width: "100%", height: 240, borderRadius: 8 }}
                        />
                        <Text style={styles.photoTitleText}>{item.photoTitle}</Text>
                        <View style={styles.postInfoWrapper}>
                            <View style={styles.commentsWrapper}>
                                <TouchableOpacity
                                    style={{ marginRight: 6 }}
                                    onPress={() => navigation.navigate("Comments", { photo: item.photo, postId: item.id, postUserId: item.userId })}
                                >
                                    <Feather
                                        name="message-circle"
                                        size={24}
                                        style={{color: item.comments ? "#FF6C00" : "#BDBDBD"}}
                                    />
                                </TouchableOpacity>
                                <Text>{item.comments || 0}</Text>
                            </View>
                            <View style={styles.commentsWrapper}>
                                <TouchableOpacity
                                    style={{ marginRight: 6 }}
                                    onPress={() => toggleLikes(item.id)}
                                >
                                    <Feather
                                        name="thumbs-up"
                                        size={24} 
                                        style={{ color: item?.likes?.includes(userId) ? "#FF6C00" : "#BDBDBD" }}
                                    />
                                </TouchableOpacity>
                                <Text>{item?.likes?.length || 0}</Text>
                            </View>
                            <View style={styles.locationWrapper}>
                                <TouchableOpacity
                                    style={{ marginRight: 4 }}
                                    onPress={() => navigation.navigate("Map", { location: item.location })}
                                >
                                    <Feather name="map-pin" size={24} color={"#BDBDBD"} />
                                </TouchableOpacity>
                                <Text style={styles.locationNameText}>{item.locationName}</Text>
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
        paddingTop: 32,
    },
    userWrapper: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: 32,
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
        alignItems: "center",
    },
    commentsWrapper: {
        flexDirection: "row",
        marginRight: 24,
    },
    locationWrapper: {
        flexDirection: "row",
        marginLeft: "auto",
    },
    locationNameText: {
        textDecorationLine: "underline",
    },
});