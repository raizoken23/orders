// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCE2YYsxZILJ3B59GSLj87vjQV8mHZojvw",
  authDomain: "studio-5927157065-7e175.firebaseapp.com",
  projectId: "studio-5927157065-7e175",
  storageBucket: "studio-5927157065-7e175.appspot.com",
  messagingSenderId: "140497194859",
  appId: "1:140497194859:web:a667d9237a297a5bdac62e"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
