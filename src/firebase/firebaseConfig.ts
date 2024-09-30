// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtR4VPFdr0KHejcL57b89JAed-DQgi3Ag",
  authDomain: "kaizen2-app.firebaseapp.com",
  projectId: "kaizen2-app",
  storageBucket: "kaizen2-app.appspot.com",
  messagingSenderId: "766051691651",
  appId: "1:766051691651:web:b0306eef3f07bbe3347fb6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;