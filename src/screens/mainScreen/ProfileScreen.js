import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Image,
    Text,
    FlatList,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { authSignOutUser, updateUserAvatar } from "../../redux/auth/authOperations";

import { db, storage } from '../../firebase/confige';
import { onSnapshot, query, collection, where, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { deleteObject, ref, getDownloadURL, uploadBytes } from "firebase/storage";


export default function ProfileScreen({ navigation }) {
    const { userId, name, avatar } = useSelector((state) => state.auth);
    const [userPosts, setUserPosts] = useState([]);
    const [updatedAvatar, setUpdatedAvatar] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        getUserPosts();
    }, [])
    
    const getUserPosts = async () => {
        try {
            const postRef = collection(db, "posts");
            const q = query(postRef, where("userId", "==", userId));
            onSnapshot(q, (data) => {
                setUserPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    const pickImageAvatar = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        
        if (!result.canceled) {
            setUpdatedAvatar(result.assets[0].uri);
        }
        return updatedAvatar;
    };

    const uploadImageAvatarToServer = async () => {
        try {
            const res = await fetch(updatedAvatar);
            const file = await res.blob();

            const uniqueAvatarId = Date.now().toString();
            const storageRef = ref(storage, `avatarImages/${uniqueAvatarId}`);
            await uploadBytes(storageRef, file);

            const photo = await getDownloadURL(storageRef);
            return photo;
        } catch (error) {
            console.log(error.message);
        }
    };

    const updateImageAvatar = async () => {
        try {
            const photoUrl = await uploadImageAvatarToServer();
            await dispatch(updateUserAvatar(photoUrl));
            setUpdatedAvatar('');

            const postImageRef = query(collection(db, 'posts'), where('userId', '==', userId));
            const querySnapshot = await getDocs(postImageRef);
            querySnapshot.forEach((doc) => {
                setDoc(doc.ref, {
                    avatar: photoUrl
                }, { merge: true })
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    const deleteImageAvatar = async (avatar) => {
        const avatarRef = ref(storage, avatar);
        await deleteObject(avatarRef);
        setUpdatedAvatar('');

        await dispatch(updateUserAvatar(updatedAvatar));
    };

    const deletePost = async (postId, photoUrl) => {
        try {
            const postImageRef = ref(storage, photoUrl);
    
            await deleteDoc(doc(db, "posts", postId));
            await deleteObject(postImageRef);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../../assets/images/bg.jpg")}
                style={styles.image}
            >
                <View style={styles.profileWrapper}>
                    <View style={styles.userAvatar}>
                        <Image
                            style={styles.avatarImg}
                            source={{ uri: updatedAvatar ? updatedAvatar : avatar }}
                        />
                        {avatar ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{ ...styles.closeBtn, borderColor: "#BDBDBD" }}
                                onPress={() => deleteImageAvatar(avatar)}
                            >
                                <Feather name="x" size={20} color={"#BDBDBD"} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{ ...styles.closeBtn, borderColor: "#FF6C00" }}
                                onPress={pickImageAvatar}
                            >
                                <Feather name="plus" size={15} color={"#FF6C00"} />
                            </TouchableOpacity>
                        )}
                        {updatedAvatar && (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{ ...styles.closeBtn, borderColor: "#FF6C00" }}
                                onPress={updateImageAvatar}
                            >
                                <Feather name="check" size={20} color={"#FF6C00"} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.userLogout}
                        onPress={() => dispatch(authSignOutUser())}
                    >
                        <Feather
                            name="log-out"
                            size={24}
                            color="#BDBDBD"
                        />
                    </TouchableOpacity>
                    <Text style={styles.userName}>{name}</Text>
                    <FlatList
                        data={userPosts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={{ marginBottom: 32, position: "relative" }}>
                                <TouchableOpacity
                                    style={styles.deletePostBtn}
                                    onPress={() => deletePost(item.id, item.photo)}
                                >
                                    <Feather name="trash-2" size={24} color={"#FF6C00"} />
                                </TouchableOpacity>
                                <Image
                                    source={{ uri: item.photo }}
                                    style={{ width: "100%", height: 240, borderRadius: 8 }}
                                />
                                <Text style={styles.photoTitleText}>{item.photoTitle}</Text>
                                <View style={styles.postInfoWrapper}>
                                    <View style={styles.commentsWrapper}>
                                        <TouchableOpacity
                                            style={{ marginRight: 6 }}
                                            onPress={() => navigation.navigate("Comments", { photo: item.photo, postId: item.id })}
                                        >
                                            <Feather name="message-circle" size={24} color={item.comments ? "#FF6C00" : "#BDBDBD"} />
                                        </TouchableOpacity>
                                        <Text>{item.comments || 0}</Text>
                                    </View>
                                    <View style={styles.commentsWrapper}>
                                        <TouchableOpacity style={{ marginRight: 6 }}>
                                            <Feather name="thumbs-up" size={24} color={item.likes ? "#FF6C00" : "#BDBDBD"} />
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
        paddingHorizontal: 16,
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
    avatarImg: {
        width: 120,
        height: 120,
        borderRadius: 16,
        resizeMode: "cover",
    },
    closeBtn: {
        position: "absolute",
        bottom: 15,
        right: -12.5,
        width: 25,
        height: 25,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 50,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#FF6C00",
    },
    userLogout: {
        position: "absolute",
        top: 25,
        right: 16,
    },
    userName: { 
        textAlign: "center",
        marginTop: 92,
        marginBottom: 32,
        fontFamily: "Roboto-Medium",
        fontSize: 30,
        lineHeight: 35,
        color: "#212121",
    },
    deletePostBtn: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 2,
        width: 35,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 50,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#FF6C00",
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