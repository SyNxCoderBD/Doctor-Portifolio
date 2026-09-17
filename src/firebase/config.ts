import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyDQgmcroBqn27XeCu9UKLLNbkiAzGp9n9k",
  authDomain: "doctor-website-a4b59.firebaseapp.com",
  projectId: "doctor-website-a4b59",
  storageBucket: "doctor-website-a4b59.firebasestorage.app",
  messagingSenderId: "785226500883",
  appId: "1:785226500883:web:c1142d4eab715fac2668e6",
  measurementId: "G-MQ5WQ7PMXP"
};

// Initialize or reuse Firebase app
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
