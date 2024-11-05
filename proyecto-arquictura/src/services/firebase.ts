//Esto es la configuracion para poder conectar mi aplicacion con firebase , esta configuracion me la da firebase cuando creo un proyecto.
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyHGcoSf5gC9YnxPaXYBbbnxvLPPXuXoM",
  authDomain: "sistemapelisterror.firebaseapp.com",
  projectId: "sistemapelisterror",
  storageBucket: "sistemapelisterror.appspot.com",
  messagingSenderId: "463306061155",
  appId: "1:463306061155:web:6bb50f5cdd219248024f56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Exporta las instancias de Auth y Firestore 
export const auth = getAuth(app);
export const db = getFirestore(app);
