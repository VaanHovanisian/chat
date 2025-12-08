// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to us

// https://firebase.google.com/docs/web/setup#available-librarie

// Your web app's Firebase configuratio

const firebaseConfig = {
  apiKey: "AIzaSyBSPl_bg69I1e6HByf50_rqNxyklawepAo",
  authDomain: "chat-bf217.firebaseapp.com",
  projectId: "chat-bf217",
  storageBucket: "chat-bf217.firebasestorage.app",
  messagingSenderId: "241221738426",
  appId: "1:241221738426:web:590996b1c38f0baf738783",
};

// Initialize Firebas

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { app, auth, db };
