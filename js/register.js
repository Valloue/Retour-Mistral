// Utilisation des objets Firebase globaux au lieu des imports
const auth = window.auth;
const db = window.db;

console.log('Register.js chargé');

const registerForm = document.getElementById('registerForm');
if (!registerForm) {
    console.error('Le formulaire d\'inscription n\'a pas été trouvé');
}

const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

// Vérification que tous les éléments sont bien trouvés
const passwordChecks = {
    length: document.getElementById('length-check'),
    uppercase: document.getElementById('uppercase-check'),
    lowercase: document.getElementById('lowercase-check'),
    number: document.getElementById('number-check'),
    special: document.getElementById('special-check')
};

// Vérifier que tous les éléments de validation sont présents
Object.entries(passwordChecks).forEach(([key, element]) => {
    if (!element) {
        console.error(`L'élément de validation ${key} n'a pas été trouvé`);
    }
});

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
    console.log('Formulaire soumis');
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    console.log('Données du formulaire:', { 
        username, 
        email, 
        passwordLength: password.length 
    });

    if (!validatePassword(password)) {
        console.log('Validation du mot de passe échouée');
        alert('Le mot de passe ne respecte pas les critères requis.');
        return;
    }

    if (password !== confirmPassword) {
        console.log('Les mots de passe ne correspondent pas');
        alert('Les mots de passe ne correspondent pas.');
        return;
    }

    try {
        console.log('Tentative de création de l\'utilisateur...');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Utilisateur créé dans Firebase Auth:', userCredential.user.uid);

        const user = userCredential.user;
        console.log('Création du document utilisateur dans Firestore...');

        await setDoc(doc(db, 'users', user.uid), {
            username,
            email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        console.log('Document utilisateur créé dans Firestore');
        console.log('Redirection vers saisie-retour.html...');
        window.location.href = 'saisie-retour.html';
    } catch (error) {
        console.error('Erreur détaillée:', error);
        console.error('Code d\'erreur:', error.code);
        console.error('Message d\'erreur:', error.message);
        
        let errorMessage = 'Une erreur est survenue lors de l\'inscription.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Cet email est déjà utilisé.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'L\'adresse email n\'est pas valide.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'L\'inscription par email/mot de passe n\'est pas activée.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Le mot de passe est trop faible.';
                break;
        }
        
        alert(errorMessage);
    }
}); 