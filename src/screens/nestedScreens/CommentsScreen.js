import React, { useState, useEffect } from "react";
import {
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { db } from "../../firebase/confige";
import { addDoc, collection, doc, onSnapshot, updateDoc } from "firebase/firestore";

export default function CommentsScreen({route}) {
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [allComments, setAllComments] = useState([]);
    const [comment, setComment] = useState("");

    const { photo, postId } = route.params;
    const { name, userId, avatar } = useSelector((state) => state.auth);

    useEffect(() => {
        getAllComments();
    }, []);

    const addComment = async () => {
        setIsShowKeyboard(false);
        Keyboard.dismiss();

        try {
            const date = new Date().toLocaleDateString();
            const time = new Date().toLocaleTimeString();

            const postRef = doc(db, "posts", postId);
            await updateDoc(postRef, {
                comments: allComments.length + 1,
            });

            await addDoc(collection(postRef, "comments"), {
                comment,
                name,
                userId,
                avatar,
                date,
                time,
            });

            setComment("");
        } catch (error) {
            console.log(error.message);
        }
    };

    const getAllComments = async () => {
        try {
            const postRef = doc(db, "posts", postId);

            onSnapshot(collection(postRef, "comments"), (data) => {
                setAllComments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Image
                    source={{ uri: photo }}
                    style={{ width: "100%", height: 240, borderRadius: 8, marginBottom: 32 }}
                ></Image>
                <FlatList
                    data={allComments}
                    style={{ display: isShowKeyboard ? "none" : "flex" }}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{
                            ...styles.commentBox,
                            flexDirection: userId === item.userId ? "row-reverse" : "row"}}>
                            <View style={{
                                ...styles.userAvatar,
                                marginRight: userId === item.userId ? 0 : 16,
                                marginLeft: userId === item.userId ? 16 : 0,
                            }}>
                                <Image source={{ uri: item.avatar }} style={{ width: 28, height: 28, borderRadius: 15 }} />
                            </View>
                            <View style={styles.commentWrapper}>
                                <Text style={styles.textComment}>{item.comment}</Text>
                                <Text style={{
                                    ...styles.date,
                                    textAlign: userId === item.userId ? "left" : "right",
                                }}>{item.date} | {item.time}</Text>
                            </View>
                        </View>
                    )}
                />
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <View style={{ marginTop: "auto" }}>
                        <TextInput
                            style={styles.input}
                            placeholder={"Залишити свій коментар..."}
                            placeholderTextColor={"#BDBDBD"}
                            value={comment}
                            multiline={true}
                            numberOfLines={3}
                            textAlignVertical="center"
                            onChangeText={(value) => setComment(value)}
                            onFocus={() => setIsShowKeyboard(true)}
                            onBlur={() => setIsShowKeyboard(false)}
                        ></TextInput>
                        <TouchableOpacity
                            style={styles.addCommentBtn}
                            onPress={addComment}
                        >
                            <Feather
                                name="arrow-up"
                                size={24}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 32,
        paddingBottom: 16,
        backgroundColor: "#FFFFFF",
    },
    commentBox: {
        width: "100%",
        flexDirection: "row",
        marginBottom: 24,
    },
    userAvatar: {
        width: 28,
        height: 28,
        borderRadius: 15,
        backgroundColor: "#F6F6F6",
    },
    commentWrapper: {
        flex: 1,
        borderRadius: 6,
        backgroundColor: "rgba(0, 0, 0, 0.03)",
        padding: 16,
    },
    textComment: {
        marginBottom: 5,
        fontFamily: "Roboto-Regular",
        fontSize: 13,
        lineHeight: 18,
        color: "#212121",
    },
    date: {
        fontFamily: "Roboto-Regular",
        fontSize: 10,
        lineHeight: 12,
        color: "#BDBDBD",
    },
    input: {
        height: 50,
        paddingLeft: 16,
        paddingRight: 60,
        paddingVertical: 16,
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        lineHeight: 19,
        color: "#212121",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#E8E8E8",
        borderRadius: 100,
        backgroundColor: "#F6F6F6",
        overflow: "scroll",
    },
    addCommentBtn: {
        position: "absolute",
        top: 8,
        right: 10,
        width: 34,
        height: 34,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: "#FF6C00",
    },
});