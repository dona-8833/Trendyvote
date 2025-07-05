import { initializeApp } from "firebase/app";
import { browserSessionPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3ieHO-CETVZEvFjsUt0L0LIMZMDsKoy0",
  authDomain: "vote-c1546.firebaseapp.com",
  projectId: "vote-c1546",
  storageBucket: "vote-c1546.firebasestorage.app",
  messagingSenderId: "819298734873",
  appId: "1:819298734873:web:a8634450c14650beda2b88",
  measurementId: "G-CCECC29Z5K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
setPersistence(auth, browserSessionPersistence); 
export const db = getFirestore(app)