// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAYksYy0KXsTf_hkXriSCOrOfrhwUQ-8M4",
//   authDomain: "icue-f15ff.firebaseapp.com",
//   databaseURL: "https://icue-f15ff-default-rtdb.firebaseio.com",
//   projectId: "icue-f15ff",
//   storageBucket: "icue-f15ff.firebasestorage.app",
//   messagingSenderId: "678755859046",
//   appId: "1:678755859046:web:1bfa59ba831bbf4130cba7",
//   measurementId: "G-QB616DEQZS"
// };

// // Initialize Firebase
// export const FIREBASE_APP = initializeApp(firebaseConfig);
// export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });
// export const FIREBASE_DB = getFirestore(FIREBASE_APP);

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYksYy0KXsTf_hkXriSCOrOfrhwUQ-8M4",
  authDomain: "icue-f15ff.firebaseapp.com",
  databaseURL: "https://icue-f15ff-default-rtdb.firebaseio.com",
  projectId: "icue-f15ff",
  storageBucket: "icue-f15ff.firebasestorage.app",
  messagingSenderId: "678755859046",
  appId: "1:678755859046:web:1bfa59ba831bbf4130cba7",
  measurementId: "G-QB616DEQZS"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);