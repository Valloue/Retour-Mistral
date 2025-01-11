import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCEvK9CVWCmNGmOvHtwNnEJ65A_33JgSq0",
  authDomain: "retour-mistral.firebaseapp.com",
  projectId: "retour-mistral",
  storageBucket: "retour-mistral.firebasestorage.app",
  messagingSenderId: "663337089772",
  appId: "1:663337089772:web:034e2446b73fa9701f03c9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 