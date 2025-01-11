import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'firebase/auth';

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'saisie-retour.html';
    } catch (error) {
        alert('Erreur de connexion : ' + error.message);
    }
}); 