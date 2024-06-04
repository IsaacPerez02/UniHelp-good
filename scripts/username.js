import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDj01lpS0GIdkvVJNU4Ivb4uuC0GR3OooU",
    authDomain: "login-ed957.firebaseapp.com",
    projectId: "login-ed957",
    storageBucket: "login-ed957.appspot.com",
    messagingSenderId: "152624494584",
    appId: "1:152624494584:web:409217d2d78ca5db00480d",
    measurementId: "G-ZTC3Q3VXYX"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Función para obtener y mostrar el nombre de usuario
function displayUsername(uid) {
    const userDocRef = doc(db, "users", uid);
    getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            document.querySelector('.username').textContent = userData.username;
            document.querySelector('.user-role').textContent = userData.type;
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

// Verificar el estado de autenticación del usuario
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuario está logueado, obtener y mostrar el nombre de usuario
        displayUsername(user.uid);
    } else {
        // Redirigir al usuario a la página de login si no está autenticado
        window.location.href = 'login.html';
    }
});

// Agregar funcionalidad al botón de logout
document.querySelector('.logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'login.html';
    }).catch((error) => {
        console.log("Error signing out:", error);
    });
});