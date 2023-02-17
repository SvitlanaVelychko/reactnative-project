import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
import * as ImagePicker from 'expo-image-picker';

import { storage, db } from '../../firebase/confige';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc } from "firebase/firestore"; 

export default function CreatePostsScreen({ navigation }) {
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [camera, setCamera] = useState(null);
    const [photo, setPhoto] = useState("");
    const [photoTitle, setPhotoTitle] = useState("");
    const [location, setLocation] = useState("");
    const [locationName, setLocationName] = useState("");

    const { userId, name, email, avatar } = useSelector((state) => state.auth);
    
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                setErrorMsg('Permission to access camera was denied');
                return;
            }
        })();
    },[]);
    
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    },[]);
    
    const takePhoto = async () => {
        try {
            const photo = await camera.takePictureAsync();
            setPhoto(photo.uri);
        } catch (error) {
            console.log(error.message);
        };
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        
        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    };

    const uploadPhotoToServer = async () => {
        try {
            const res = await fetch(photo);
            const file = await res.blob();

            const uniquePostId = Date.now().toString();
            const storageRef = ref(storage, `postImages/${uniquePostId}`);
            await uploadBytes(storageRef, file);

            const processedPhoto = await getDownloadURL(storageRef);
            return processedPhoto;
        } catch (error) {
            console.log(error.message);
        }
    };

    const uploadPostToServer = async () => {
        try {
            const photo = await uploadPhotoToServer();
            
            await addDoc(collection(db, "posts"), {
                photo,
                photoTitle,
                location,
                locationName,
                userId,
                name,
                email,
                avatar,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    const postPhoto = async () => {
        try {
            setIsShowKeyboard(false);
            Keyboard.dismiss();

            await uploadPostToServer();
            reset();
            navigation.navigate('DefaultScreen');
        } catch (error) {
            console.log(error.message);
        }
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
                            {photo ? (
                                <View style={styles.takePhotoWrapper}>
                                    <Image
                                        source={{ uri: photo }}
                                        style={{ width: 360, height: 240, borderRadius: 8 }}
                                    />
                                </View>
                            ) : (
                                <Camera
                                    style={styles.camera}
                                    ref={(ref) => setCamera(ref)}
                                >
                                    <TouchableOpacity
                                        style={styles.snapBtn}
                                        onPress={takePhoto}
                                    >
                                        <Feather name="camera" size={24} color={"#BDBDBD"} />
                                    </TouchableOpacity>
                                </Camera>
                            )}
                            <TouchableOpacity
                                style={{ marginTop: 8 }}
                                activeOpacity={0.8}
                                onPress={pickImage}
                            >
                                <Text style={styles.uploadPhotoText}>
                                    {photo ? "Редагувати фото" : "Завантажити фото"}</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TextInput
                                style={{ ...styles.input, marginBottom: 16 }}
                                placeholder={"Назва..."}
                                placeholderTextColor={"#BDBDBD"}
                                value={photoTitle}
                                onChangeText={setPhotoTitle}
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
        position: "relative",
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