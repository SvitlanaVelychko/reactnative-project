import { useState } from 'react';
import {
    TouchableWithoutFeedback,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from 'react-native';

import { useDispatch } from 'react-redux';
import { authSignInUser } from "../../redux/auth/authOperations";


const initialState = {
    email: "",
    password: "",
};

export default function RegistrationScreen ({navigation}) {
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [user, setUser] = useState(initialState);

    const dispatch = useDispatch();

    const handleSubmit = () => {
        setIsShowKeyboard(false);
        Keyboard.dismiss();

        dispatch(authSignInUser(user));
        setUser(initialState);
    };

    const onShowPassword = () => {
        setIsPasswordHidden(!isPasswordHidden);
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container} >
                <ImageBackground
                    source={require("../../../assets/images/bg.jpg")}
                    style={styles.image}>
                    <View style={styles.formContainer}>
                        <Text style={styles.pageTitle}>Ввійти</Text>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                        >
                            <View style={{ ...styles.form, marginBottom: isShowKeyboard ? -90 : 110 }}>
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
                                    <Text style={styles.btnTitle}>Ввійти</Text>
                                </TouchableOpacity>
                                <View style={styles.linkWrapper}>
                                    <Text style={styles.linkText}>Відсутній аккаунт? </Text>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("Registration")}
                                        activeOpacity={0.8}
                                        style={styles.link}>
                                        <Text style={styles.linkText}>Зареєструватись</Text>
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
    form: {
        marginHorizontal: 16,
    },
    pageTitle: {
        marginBottom: 32,
        marginTop: 32,
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