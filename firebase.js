// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase (desde Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCSTrupcVkG47V928MBIMHipHaZrDlNzHc",
  authDomain: "chilenizador.firebaseapp.com",
  projectId: "chilenizador",
  storageBucket: "chilenizador.firebasestorage.app",
  messagingSenderId: "784941402691",
  appId: "1:784941402691:web:48811e6a7230af624de2f6",
  measurementId: "G-1NMLLN4V5S"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);
