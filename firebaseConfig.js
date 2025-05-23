// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAZpWlEhATHihNF7l1Suw3SeL2ZlKJvP6E",
  authDomain: "ecotrash-v2.firebaseapp.com",
  projectId: "ecotrash-v2",
  storageBucket: "ecotrash-v2.appspot.com",
  appId: "1:68905272825:android:66c9c45dce2957c8066928",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Auth com persistência
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };


