import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

// Vérification de l'authentification
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
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

// Gestion des activités
const addButtons = document.querySelectorAll('.add-btn');
const activitesLists = {
    matin: document.getElementById('activitesMatin'),
    apresMidi: document.getElementById('activitesApresMidi'),
    problematiques: document.getElementById('problematiques')
};

addButtons.forEach(button => {
    button.addEventListener('click', () => {
        const section = button.dataset.section;
        createNewActivity(section);
    });
});

async function createNewActivity(section) {
    const title = prompt(`Nouvelle activité ${section}`);
    if (!title) return;

    try {
        const docRef = await addDoc(collection(db, 'activities'), {
            userId: auth.currentUser.uid,
            section,
            title,
            content: '',
            createdAt: new Date().toISOString()
        });

        addActivityToList(section, {
            id: docRef.id,
            title
        });
    } catch (error) {
        console.error('Erreur lors de la création de l\'activité:', error);
        alert('Erreur lors de la création de l\'activité');
    }
}

function addActivityToList(section, activity) {
    const div = document.createElement('div');
    div.className = 'activity-item';
    div.dataset.id = activity.id;
    div.textContent = activity.title;
    div.onclick = () => selectActivity(activity.id);

    activitesLists[section].appendChild(div);
}

async function selectActivity(activityId) {
    // Désélectionner l'activité précédente
    document.querySelectorAll('.activity-item.active').forEach(item => {
        item.classList.remove('active');
    });

    // Sélectionner la nouvelle activité
    const activityElement = document.querySelector(`[data-id="${activityId}"]`);
    activityElement.classList.add('active');

    // Charger le contenu de l'activité
    const editor = document.getElementById('editor');
    editor.innerHTML = '<textarea id="activityContent" style="width: 100%; height: 400px;"></textarea>';
    
    const textarea = document.getElementById('activityContent');
    textarea.addEventListener('input', async () => {
        try {
            await updateDoc(doc(db, 'activities', activityId), {
                content: textarea.value,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    });
}

// Charger les activités existantes au chargement de la page
async function loadActivities() {
    try {
        const q = query(
            collection(db, 'activities'),
            where('userId', '==', auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const activity = {
                id: doc.id,
                ...doc.data()
            };
            addActivityToList(activity.section, activity);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
    }
}

// Attendre que l'authentification soit établie avant de charger les activités
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadActivities();
    }
}); 