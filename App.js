import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("./assets/images/bg.jpg")}
        style={styles.image}>
        <View style={styles.formContainer}>
          <Text style={styles.text}>Реєстрація</Text>
          <View style={styles.form}>
            <View>
              <TextInput
                style={styles.input}
                textAlign={'left'}
                placeholder={"Логін"}
                placeholderTextColor={"#BDBDBD"}
              />
            </View>
            <View>
              <TextInput
                style={styles.input}
                textAlign={'left'}
                placeholder={"Адреса електронної пошти"}
                placeholderTextColor={"#BDBDBD"}
              />
            </View>
            <View style={{marginBottom: 43}}>
              <TextInput
                style={styles.input}
                textAlign={'left'}
                placeholder={"Пароль"}
                placeholderTextColor={"#BDBDBD"}
                secureTextEntry={true}
              />
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.btn}>
              <Text style={styles.btnTitle}>Зареєструватися</Text>
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
    height: 549,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  form: {
    marginHorizontal: 16,
  },
  text: {
    marginBottom: 32,
    marginTop: 32,
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 30,
    lineHeight: 35,
    color: "#212121",
  },
  input: {
    paddingLeft: 16,
    marginBottom: 16,
    height: 50,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    color: "#BDBDBD",
    fontSize: 16,
    lineHeight: 1.19,
  },
  btn: {
    // flex: 1,
    alignContent: "center",
    justifyContent: "center",
    marginBottom: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FF6C00",
    borderRadius: 100,
  },
  btnTitle: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});
