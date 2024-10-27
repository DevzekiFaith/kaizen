// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBtR4VPFdr0KHejcL57b89JAed-DQgi3Ag",
  authDomain: "kaizen2-app.firebaseapp.com",
  projectId: "kaizen2-app",
  storageBucket: "kaizen2-app.appspot.com",
  messagingSenderId: "766051691651",
  appId: "1:766051691651:web:b0306eef3f07bbe3347fb6",
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
