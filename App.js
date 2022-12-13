import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';

export default function App() {
  console.log(Platform.OS)
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("./assets/images/bg.jpg")}
        style={styles.image}>
        <View style={styles.formContainer}>
          <View style={styles.userAvatar}>
            <Image
              source={require("./assets/images/add.png")}
              style={styles.addBtn}
            />
          </View>
          <Text style={styles.text}>Регистрация</Text>
          <View style={styles.form}>
            <View style={{marginBottom: 16}}>
              <TextInput
                style={styles.input}
                textAlign={'left'}
                placeholder={"Логин"}
                placeholderTextColor={"#BDBDBD"}
              />
            </View>
            <View style={{marginBottom: 16}}>
              <TextInput
                style={styles.input}
                textAlign={'left'}
                placeholder={"Адрес електронной почты"}
                placeholderTextColor={"#BDBDBD"}
              />
            </View>
            <View style={{marginBottom: 43, position: "relative"}}>
              <TextInput
                style={styles.input}
                textAlign={'left'}
                placeholder={"Пароль"}
                placeholderTextColor={"#BDBDBD"}
                secureTextEntry={true}
              />
              <TouchableOpacity activeOpacity={0.8} style={styles.passwordLink}>
              <Text style={styles.linkText}>Показать</Text>
            </TouchableOpacity>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.btn}>
              <Text style={styles.btnTitle}>Зарегистрироваться</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.link}>
              <Text style={styles.linkText}>Уже есть аккаунт? Войти</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    // alignItems: "center",
    justifyContent: "flex-end",
  },
  formContainer: {
    position: "relative",
    height: 550,
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
  },
  addBtn: {
    position: "absolute",
    bottom: 15,
    right: -12.5,
  },
  form: {
    marginHorizontal: 16,
  },
  text: {
    marginBottom: 32,
    marginTop: 92,
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 30,
    lineHeight: 35,
    color: "#212121",
  },
  input: {
    paddingLeft: 16,
    height: 50,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    color: "#BDBDBD",
    fontSize: 16,
    lineHeight: 1.19,
  },
  passwordLink: {
    position: "absolute",
    right: 16,
    top: 16,
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
    fontSize: 16,
    color: "#FFFFFF",
  },
  link: {
    alignItems: "center",
  },
  linkText: {
    fontSize: 16,
    color: "#1B4371",
  }
});
