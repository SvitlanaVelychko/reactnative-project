import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import {
    TouchableWithoutFeedback,
    Keyboard,
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    TextInput,
} from "react-native";
import { Camera } from "expo-camera";
import * as Location from 'expo-location';

export default function CreatePostsScreen({ navigation }) {
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [camera, setCamera] = useState(null);
    const [photo, setPhoto] = useState("");
    const [photoTitle, setPhotoTitle] = useState("");
    const [location, setLocation] = useState("");
    const [locationName, setLocationName] = useState("");
    
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();

            console.log(status);
        })();
    },[]);
    
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
        })();
    },[]);
    
    const takePhoto = async () => {
        if (!camera) return;
        try {
            const { status } = await Camera.getCameraPermissionsAsync();

            if (status !== 'granted') {
                setErrorMsg('Permission to access camera was denied');
                return;
            }

            const photo = await camera.takePictureAsync();
            const location = await Location.getCurrentPositionAsync();
            setPhoto(photo.uri);
            setLocation(location.coords);
        } catch (error) {
            console.log(error.message);
        };
    };

    const postPhoto = async () => {
        setIsShowKeyboard(false);
        Keyboard.dismiss();
        navigation.navigate('DefaultScreen', { photo, location, locationName, photoTitle });
    };

    const reset = () => {
        setPhoto("");
        setPhotoTitle("");
        setLocation("");
        setLocationName("");
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <View style={{ ...styles.form, marginBottom: isShowKeyboard ? 80 : 20 }}>
                        <View style={styles.photoWrapper}>
                            <Camera
                                style={styles.camera}
                                ref={setCamera}
                            >
                                {photo && (
                                    <View style={styles.takePhotoWrapper}>
                                        <Image
                                            source={{ uri: photo }}
                                            style={{ width: 360, height: 240, borderRadius: 8 }}
                                        />
                                    </View>
                                )}
                                <TouchableOpacity
                                    style={styles.snapBtn}
                                    onPress={takePhoto}
                                >
                                    <Feather name="camera" size={24} color={"#BDBDBD"} />
                                </TouchableOpacity>
                            </Camera>
                            <TouchableOpacity
                                style={{ marginTop: 8 }}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.uploadPhotoText}>Завантажити фото</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TextInput
                                style={{ ...styles.input, marginBottom: 16 }}
                                placeholder={"Назва..."}
                                placeholderTextColor={"#BDBDBD"}
                                value={photoTitle}
                                onChangeText={(value) => setPhotoTitle(value)}
                                onFocus={() => setIsShowKeyboard(true)}
                                onBlur={() => setIsShowKeyboard(false)}
                            ></TextInput>
                        </View>
                        <View>
                            <TextInput
                                style={{ ...styles.input, paddingLeft: 28 }}
                                placeholder={"Місцевість..."}
                                placeholderTextColor={"#BDBDBD"}
                                value={locationName}
                                onChangeText={(value) => setLocationName(value)}
                                onFocus={() => setIsShowKeyboard(true)}
                                onBlur={() => setIsShowKeyboard(false)}
                            ></TextInput>
                            <Feather
                                name="map-pin"
                                size={24}
                                color="#BDBDBD"
                                style={styles.locationIcon}
                            />
                        </View>
                        <TouchableOpacity
                            style={{
                                ...styles.postBtn,
                                backgroundColor: (photo && photoTitle && locationName)
                                ? "#FF6C00" : "#F6F6F6",
                            }}
                            onPress={postPhoto}
                        >
                            <Text style={{
                                ...styles.postBtnText,
                                color: (photo && photoTitle && locationName)
                                ? "#FFFFFF" : "#BDBDBD",
                            }}>Опублікувати</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteBtn} onPress={reset}>
                            <Feather name="trash-2" size={24} color="#BDBDBD" />
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
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
    },
    photoWrapper: {
        marginVertical: 32,
    },
    camera: {
        height: 240,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    takePhotoWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "#F6F6F6",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#E8E8E8",
        borderRadius: 8,
    },
    snapBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
    },
    uploadPhotoText: {
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        lineHeight: 19,
        color: "#BDBDBD",
    },
    input: {
        height: 50,
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        lineHeight: 19,
        color: "#212121",
        borderBottomWidth: 1,
        borderBottomColor: "#E8E8E8",
    },
    locationIcon: {
        position: "absolute",
        top: 7,
        left: 0,
    },
    postBtn: {
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 32,
        borderRadius: 100,
    },
    postBtnText: {
        fontFamily: "Roboto-Regular",
        fontSize: 16,
    },
    deleteBtn: {
        width: 70,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: "#F6F6F6",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 120,
    },
});