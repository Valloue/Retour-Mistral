import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

console.log('Initialisation de Firebase...');

const firebaseConfig = {
  apiKey: "AIzaSyCEvK9CVWCmNGmOvHtwNnEJ65A_33JgSq0",
  authDomain: "retour-mistral.firebaseapp.com",
  projectId: "retour-mistral",
  storageBucket: "retour-mistral.firebasestorage.app",
  messagingSenderId: "663337089772",
  appId: "1:663337089772:web:034e2446b73fa9701f03c9"
};

try {
  console.log('Configuration Firebase:', firebaseConfig);
  const app = initializeApp(firebaseConfig);
  console.log('Firebase initialisé avec succès');
  
  const auth = getAuth(app);
  console.log('Auth initialisé');
  
  const db = getFirestore(app);
  console.log('Firestore initialisé');

  export { auth, db };
} catch (error) {
  console.error('Erreur lors de l\'initialisation de Firebase:', error);
  throw error;
} 