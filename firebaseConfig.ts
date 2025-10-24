// firebaseConfig.js
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, firebaseConfig, storage };
