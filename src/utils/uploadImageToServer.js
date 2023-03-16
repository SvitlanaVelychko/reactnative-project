import { storage } from "../firebase/confige";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Alert } from "react-native";

export const uploadImageToServer = async (photo, path) => {
    try {
        const res = await fetch(photo);
        const file = await res.blob();

        const fileId = Date.now().toString();
        const storageRef = ref(storage, `${path}/${fileId}`);
        await uploadBytes(storageRef, file);

        const photoURL = await getDownloadURL(storageRef);
        return photoURL;
    } catch (error) {
        Alert.alert('Something wrong! Please try again!');
        console.log(error.message);
    }
};