// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtfoF3fCRHJ9TTGiMM-r7VcsY4EGbzkws",
  authDomain: "sb-ware.firebaseapp.com",
  projectId: "sb-ware",
  storageBucket: "sb-ware.appspot.com",
  messagingSenderId: "543893432843",
  appId: "1:543893432843:web:6f77dcada4a2298a09f50e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

