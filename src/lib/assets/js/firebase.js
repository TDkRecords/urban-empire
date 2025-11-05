// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAPyxIcnrHkjWloixTPsREPhV9kZMvgh00",
    authDomain: "urban-empire-7f8ca.firebaseapp.com",
    projectId: "urban-empire-7f8ca",
    storageBucket: "urban-empire-7f8ca.firebasestorage.app",
    messagingSenderId: "551607373927",
    appId: "1:551607373927:web:1cbb646c3fed14359dc4c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Configurar el proveedor de Google
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});
googleProvider.addScope('profile');
googleProvider.addScope('email');