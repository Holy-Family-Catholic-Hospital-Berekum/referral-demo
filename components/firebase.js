import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your Firebase project's config (Project settings > General
// > Your apps > SDK setup and configuration).
const firebaseConfig = {
  apiKey: "AIzaSyDRIIx2mlNu0IulJBPjOvf03GNdeeLj1gk",
  authDomain: "referral-demo-401fe.firebaseapp.com",
  projectId: "referral-demo-401fe",
  storageBucket: "referral-demo-401fe.firebasestorage.app",
  messagingSenderId: "592862335601",
  appId: "1:592862335601:web:e2c5e4d3c2684bc172c1d0",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
