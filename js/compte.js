import { auth, db } from './firebase-config.js';
import { 
    onAuthStateChanged, 
    signOut, 
    updatePassword, 
    updateEmail 
} from 'firebase/auth';
import { 
    doc, 
    getDoc, 
    updateDoc, 
    collection, 
    query, 
    where, 
    getDocs,
    orderBy,
    limit 
} from 'firebase/firestore';

// Vérification de l'authentification
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        loadUserProfile(user);
        loadStatistics();
    }
});

// Chargement du profil utilisateur
async function loadUserProfile(user) {
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        document.getElementById('username').textContent = userData.username;
        document.getElementById('email').textContent = userData.email;
        document.getElementById('createdAt').textContent = new Date(userData.createdAt).toLocaleDateString('fr-FR');

        // Pré-remplir le formulaire de modification
        document.getElementById('editUsername').value = userData.username;
        document.getElementById('editEmail').value = userData.email;
    } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
    }
}

// Gestion des statistiques
async function loadStatistics() {
    const userId = auth.currentUser.uid;
    
    try {
        // Total des retours
        const totalRetours = await getTotalRetours(userId);
        document.getElementById('totalRetours').textContent = totalRetours;

        // Graphiques
        await createRetoursTrendChart(userId);
        await createActivitesTypeChart(userId);
        await loadRecentIssues(userId);
        await createWeeklyActivityChart(userId);
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
    }
}

// Graphique des tendances de retours
async function createRetoursTrendChart(userId) {
    const ctx = document.getElementById('retoursTrendChart').getContext('2d');
    const data = await getRetoursTrendData(userId);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Retours',
                data: data.values,
                borderColor: '#007bff',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Graphique des types d'activités
async function createActivitesTypeChart(userId) {
    const ctx = document.getElementById('activitesTypeChart').getContext('2d');
    const data = await getActivitesTypeData(userId);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Matin', 'Après-midi', 'Problématiques'],
            datasets: [{
                data: [data.matin, data.apresMidi, data.problematiques],
                backgroundColor: ['#28a745', '#ffc107', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Chargement des problématiques récentes
async function loadRecentIssues(userId) {
    const issuesContainer = document.getElementById('recentIssues');
    const issues = await getRecentIssues(userId);

    issues.forEach(issue => {
        const issueElement = document.createElement('div');
        issueElement.className = 'issue-item';
        issueElement.textContent = issue.title;
        issuesContainer.appendChild(issueElement);
    });
}

// Gestion du modal de modification
const editProfileBtn = document.getElementById('editProfileBtn');
const editProfileModal = document.getElementById('editProfileModal');
const editProfileForm = document.getElementById('editProfileForm');
const modalClose = document.querySelector('.modal-close');

editProfileBtn.onclick = () => {
    editProfileModal.style.display = 'block';
};

modalClose.onclick = () => {
    editProfileModal.style.display = 'none';
};

// Gestion de la soumission du formulaire
editProfileForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const newUsername = document.getElementById('editUsername').value;
    const newEmail = document.getElementById('editEmail').value;
    const newPassword = document.getElementById('editPassword').value;

    try {
        const user = auth.currentUser;
        const userRef = doc(db, 'users', user.uid);

        // Mise à jour du profil dans Firestore
        await updateDoc(userRef, {
            username: newUsername,
            email: newEmail,
            updatedAt: new Date().toISOString()
        });

        // Mise à jour de l'email si modifié
        if (newEmail !== user.email) {
            await updateEmail(user, newEmail);
        }

        // Mise à jour du mot de passe si fourni
        if (newPassword) {
            await updatePassword(user, newPassword);
        }

        editProfileModal.style.display = 'none';
        location.reload();
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        alert('Erreur lors de la mise à jour du profil: ' + error.message);
    }
};

// Fonctions utilitaires pour les statistiques
async function getTotalRetours(userId) {
    const q = query(
        collection(db, 'activities'),
        where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
}

async function getRetoursTrendData(userId) {
    // Implémentation de la récupération des données de tendance
    // À adapter selon vos besoins spécifiques
    return {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
        values: [12, 19, 15, 17, 14]
    };
}

async function getActivitesTypeData(userId) {
    // Implémentation du comptage par type
    const q = query(collection(db, 'activities'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    const counts = {
        matin: 0,
        apresMidi: 0,
        problematiques: 0
    };

    snapshot.forEach(doc => {
        const activity = doc.data();
        counts[activity.section]++;
    });

    return counts;
}

async function getRecentIssues(userId) {
    const q = query(
        collection(db, 'activities'),
        where('userId', '==', userId),
        where('section', '==', 'problematiques'),
        orderBy('createdAt', 'desc'),
        limit(5)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
}

// Gestion de la déconnexion
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
    }
}); 