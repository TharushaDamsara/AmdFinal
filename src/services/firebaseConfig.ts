import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  // @ts-ignore - getReactNativePersistence is available in the RN entry point
  getReactNativePersistence
} from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  memoryLocalCache
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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

// Initialize Firebase Auth with persistence based on platform
export const auth = Platform.OS === 'web'
  ? getAuth(app)
  : initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

// Initialize Firestore with appropriate caching strategy
export const db = initializeFirestore(app, {
  localCache: Platform.OS === 'web'
    ? persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
    : memoryLocalCache(), // Use memory cache on native to avoid IndexedDB errors/warnings
  experimentalForceLongPolling: true
});

export const storage = getStorage(app);
export default app;
