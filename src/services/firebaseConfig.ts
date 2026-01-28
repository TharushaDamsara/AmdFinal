import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBiuUJWFT7-icmQ0MrfghExuGPU2zzmlo0",
  authDomain: "food-donation-app-ba16d.firebaseapp.com",
  projectId: "food-donation-app-ba16d",
  storageBucket: "food-donation-app-ba16d.firebasestorage.app",
  messagingSenderId: "1088271279604",
  appId: "1:1088271279604:web:1fa6dde35bbc3d62f4c5a1",
  measurementId: "G-34JL8D7E9P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
