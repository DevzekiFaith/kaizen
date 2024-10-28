// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration for client-side


// Initialize Firebase only if it hasn't been initialized already
let app;
try {
  app = !getApps().length ? initializeApp() : getApps()[0];
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Provide default app for development
  app = !getApps().length ? initializeApp({
    apiKey: "AIzaSyBtR4VPFdr0KHejcL57b89JAed-DQgi3Ag",
    authDomain: "kaizen2-app.firebaseapp.com",
    projectId: "kaizen2-app",
    storageBucket: "kaizen2-app.appspot.com",
    messagingSenderId: "766051691651",
    appId: "1:766051691651:web:b0306eef3f07bbe3347fb6"
  
  }) : getApps()[0];
}

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
