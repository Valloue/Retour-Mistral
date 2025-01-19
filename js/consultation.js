import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Vérification de l'authentification
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
    }
});

// Configuration du sélecteur de date
flatpickr("#datePicker", {
    locale: "fr",
    dateFormat: "d/m/Y",
    onChange: function(selectedDates) {
        loadActivities(selectedDates[0]);
    }
});

// Gestion de la déconnexion
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
    }
});

// Chargement des activités
async function loadActivities(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const q = query(
            collection(db, 'activities'),
            where('userId', '==', auth.currentUser.uid),
            where('createdAt', '>=', startOfDay.toISOString()),
            where('createdAt', '<=', endOfDay.toISOString())
        );

        const querySnapshot = await getDocs(q);
        clearLists();
        
        querySnapshot.forEach((doc) => {
            const activity = {
                id: doc.id,
                ...doc.data()
            };
            addActivityCard(activity);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
    }
}

function clearLists() {
    document.getElementById('matinList').innerHTML = '';
    document.getElementById('apresMidiList').innerHTML = '';
    document.getElementById('problematiquesList').innerHTML = '';
}

function addActivityCard(activity) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-title">${activity.title}</div>
        <div class="card-content">${activity.content || 'Aucun contenu'}</div>
    `;
    
    card.onclick = () => showActivityModal(activity);

    const listId = {
        matin: 'matinList',
        apresMidi: 'apresMidiList',
        problematiques: 'problematiquesList'
    }[activity.section];

    document.getElementById(listId).appendChild(card);
}

function showActivityModal(activity) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${activity.title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${activity.content || 'Aucun contenu'}
            </div>
        </div>
    `;

    modal.querySelector('.modal-close').onclick = () => {
        document.body.removeChild(modal);
    };

    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };

    document.body.appendChild(modal);
    modal.style.display = 'block';
}

// Charger les activités du jour actuel au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    loadActivities(today);
}); 