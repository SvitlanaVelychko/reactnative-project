import { useState } from 'react';
import {
    TouchableWithoutFeedback,
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

import { useDispatch } from 'react-redux';
import { authSignUpUser } from "../../redux/auth/authOperations";

import { storage } from "../../firebase/confige";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const initialState = {
    name: "",
    email: "",
    password: "",
    avatar: "",
};

export default function RegistrationScreen ({navigation}) {
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [user, setUser] = useState(initialState);
    const [avatar, setAvatar] = useState("");

    const dispatch = useDispatch();

    const onShowPassword = () => {
        setIsPasswordHidden(!isPasswordHidden);
    };

    const pickImageAvatar = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        
        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const deleteImageAvatar = () => {
        setAvatar(null);
    };

    const uploadImageAvatarToServer = async () => {
        try {
            const res = await fetch(avatar);
            const file = await res.blob();

            const uniqueAvatarId = Date.now().toString();
            const storageRef = ref(storage, `avatarImages/${uniqueAvatarId}`);
            await uploadBytes(storageRef, file);

            const processedPhoto = await getDownloadURL(storageRef);
            return processedPhoto;
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleSubmit = async () => {
        try {
            setIsShowKeyboard(false);
            Keyboard.dismiss();

            const photoUrl = await uploadImageAvatarToServer();
            const newUser = {
                avatar: photoUrl,
                name: user.name,
                email: user.email,
                password: user.password,
            };
            
            await dispatch(authSignUpUser(newUser));
            setUser(initialState);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container} >
                <ImageBackground
                    source={require("../../../assets/images/bg.jpg")}
                    style={styles.image}>
                    <View style={styles.formContainer}>
                        <View style={styles.userAvatar}>
                            <ImageBackground
                                style={{ width: 120, height: 120 }}
                                source={require("../../../assets/images/default-avatar.png")}>
                                {avatar && (
                                    <Image
                                        style={styles.avatarImg}
                                        source={{ uri: avatar }}
                                    />
                                )}
                            </ImageBackground>
                            {avatar ? (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{...styles.closeBtn, borderColor: "#BDBDBD"}}
                                    onPress={deleteImageAvatar}
                                >
                                    <Feather name="x" size={20} color={"#BDBDBD"} />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{...styles.closeBtn, borderColor: "#FF6C00"}}
                                    onPress={pickImageAvatar}
                                >
                                    <Feather name="plus" size={20} color={"#FF6C00"} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text style={styles.pageTitle}>Реєстрація</Text>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                        >
                            <View style={{ ...styles.form, marginBottom: isShowKeyboard ? -90 : 45 }}>
                                <View style={{ marginBottom: 16 }}>
                                    <TextInput
                                        style={{
                                            ...styles.input,
                                            borderColor: isShowKeyboard ? "#FF6C00" : "#E8E8E8",
                                            backgroundColor: isShowKeyboard ? "#FFFFFF" : "#F6F6F6",
                                        }}
                                        placeholder={"Логін"}
                                        placeholderTextColor={"#BDBDBD"}
                                        value={user.name}
                                        onChangeText={(value) => setUser((prevState) => ({ ...prevState, name: value }))}
                                        onFocus={() => setIsShowKeyboard(true)}
                                        onBlur={() => setIsShowKeyboard(false)}
                                    />
                                </View>
                                <View style={{ marginBottom: 16 }}>
                                    <TextInput
                                        style={{
                                            ...styles.input,
                                            borderColor: isShowKeyboard ? "#FF6C00" : "#E8E8E8",
                                            backgroundColor: isShowKeyboard ? "#FFFFFF" : "#F6F6F6",
                                        }}
                                        placeholder={"Адреса електронної пошти"}
                                        placeholderTextColor={"#BDBDBD"}
                                        value={user.email}
                                        onChangeText={(value) => setUser((prevState) => ({ ...prevState, email: value }))}
                                        onFocus={() => setIsShowKeyboard(true)}
                                        onBlur={() => setIsShowKeyboard(false)}
                                    />
                                </View>
                                <View style={{ marginBottom: 43, position: "relative" }}>
                                    <TextInput
                                        style={{
                                            ...styles.input,
                                            borderColor: isShowKeyboard ? "#FF6C00" : "#E8E8E8",
                                            backgroundColor: isShowKeyboard ? "#FFFFFF" : "#F6F6F6",
                                        }}
                                        placeholder={"Пароль"}
                                        placeholderTextColor={"#BDBDBD"}
                                        value={user.password}
                                        secureTextEntry={isPasswordHidden}
                                        onChangeText={(value) => setUser((prevState) => ({ ...prevState, password: value }))}
                                        onFocus={() => setIsShowKeyboard(true)}
                                        onBlur={() => setIsShowKeyboard(false)}
                                    />
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={styles.passwordLink}
                                        onPress={onShowPassword}
                                    >
                                        <Text style={styles.passwordLinkText}>
                                            {isPasswordHidden ? "Показати" : "Приховати"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.btn}
                                    onPress={handleSubmit}
                                >
                                    <Text style={styles.btnTitle}>Зареєструватися</Text>
                                </TouchableOpacity>
                                <View style={styles.linkWrapper}>
                                    <Text style={styles.linkText}>Вже є аккаунт? </Text>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("Login")}
                                        activeOpacity={0.8}
                                        style={styles.link}
                                    >
                                        <Text style={styles.linkText}>Ввійти</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "flex-end",
    },
    formContainer: {
        position: "relative",
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    userAvatar: {
        position: "absolute",
        top: -60,
        alignSelf: "center",
        width: 120,
        height: 120,
        borderRadius: 16,
        backgroundColor: "#F6F6F6",
        resizeMode: "cover",
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
    },
    form: {
        marginHorizontal: 16,
    },
    pageTitle: {
        marginBottom: 32,
        marginTop: 92,
        marginLeft: "auto",
        marginRight: "auto",
        fontFamily: "Roboto-Medium",
        fontSize: 30,
        lineHeight: 35,
        color: "#212121",
    },
    input: {
        paddingLeft: 16,
        paddingBottom: 0,
        paddingTop: 0,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        textAlign: "left",
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        lineHeight: 19,
        color: "#212121",
    },
    passwordLink: {
        position: "absolute",
        right: 16,
        top: 16,
    },
    passwordLinkText: {
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        color: "#1B4371",
    },
    btn: {
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        backgroundColor: "#FF6C00",
        borderRadius: 100,
    },
    btnTitle: {
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        color: "#FFFFFF",
    },
    linkWrapper: {
        flexDirection: "row",
        justifyContent: "center",
    },
    link: {
        alignItems: "center",
    },
    linkText: {
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        color: "#1B4371",
    },
});