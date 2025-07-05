import { initializeApp } from "firebase/app";
import { browserSessionPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD58PPe3CwB1SURHx2kjuP_E5B8r-9AXKk",
  authDomain: "myfirstfirebaseapp-eb8b3.firebaseapp.com",
  projectId: "myfirstfirebaseapp-eb8b3",
  storageBucket: "myfirstfirebaseapp-eb8b3.firebasestorage.app",
  messagingSenderId: "1064280494580",
  appId: "1:1064280494580:web:00aa9e7d5225c3132de9a1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
setPersistence(auth, browserSessionPersistence); 
export const db = getFirestore(app)