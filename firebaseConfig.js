import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAKQpMTfX0SSe_6s16ZkBCjPFz7SHuPSI",
  authDomain: "videoplayer-fb6c7.firebaseapp.com",
  projectId: "videoplayer-fb6c7",
  storageBucket: "videoplayer-fb6c7.firebasestorage.app",
  messagingSenderId: "439617834638",
  appId: "1:439617834638:web:1faab75bddb3a5c690c3df",
  measurementId: "G-T7T67J8YXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };