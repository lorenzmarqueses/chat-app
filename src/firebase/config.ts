// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APPID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID,
  databaseURL: process.env.NEXT_PUBLIC_DATABASEURL,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyA-MPS-cuA47BUWIZ9M5dSveZZtYcB251A",
//   authDomain: "chat-app-84707.firebaseapp.com",
//   projectId: "chat-app-84707",
//   storageBucket: "chat-app-84707.appspot.com",
//   messagingSenderId: "623880589258",
//   appId: "1:623880589258:web:afb79e7ee68dfbee2a8933",
//   measurementId: "G-HFCR2PSWJ9",
// };

// Initialize Firebase
let firebase_app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export default firebase_app;
