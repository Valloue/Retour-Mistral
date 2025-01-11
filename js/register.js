import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const registerForm = document.getElementById('registerForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

const passwordChecks = {
    length: document.getElementById('length-check'),
    uppercase: document.getElementById('uppercase-check'),
    lowercase: document.getElementById('lowercase-check'),
    number: document.getElementById('number-check'),
    special: document.getElementById('special-check')
};

const validatePassword = (password) => {
    const checks = {
        length: password.length >= 10,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    Object.keys(checks).forEach(check => {
        const element = passwordChecks[check];
        if (checks[check]) {
            element.textContent = '✅ ' + element.textContent.slice(2);
            element.classList.add('valid');
            element.classList.remove('invalid');
        } else {
            element.textContent = '❌ ' + element.textContent.slice(2);
            element.classList.add('invalid');
            element.classList.remove('valid');
        }
    });

    return Object.values(checks).every(check => check === true);
};

passwordInput.addEventListener('input', () => {
    validatePassword(passwordInput.value);
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!validatePassword(password)) {
        alert('Le mot de passe ne respecte pas les critères requis.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Créer le profil utilisateur dans Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            username,
            email,
            createdAt: new Date().toISOString()
        });

        window.location.href = 'saisie-retour.html';
    } catch (error) {
        alert('Erreur lors de l\'inscription : ' + error.message);
    }
}); 