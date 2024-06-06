import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, query, where, getDocs, collection, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


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

// Función para leer los datos del usuario desde Firestore
async function readUserData(user) {
    const q = query(collection(db, "user"), where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        if (doc.exists()) {
            const userData = doc.data();
            document.getElementById("display-username").textContent = userData.nickname;
            document.getElementById("display-email").textContent = userData.email;
            document.getElementById("display-role").textContent = userData.type;
        } else {
            console.log("No such document!");
        }
    });
}

// Escuchar cambios en la autenticación del usuario
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuario autenticado, llamar a la función para leer los datos del usuario
        readUserData(user);
    } else {
        // No hay usuario autenticado, redirigir a la página de inicio de sesión
        window.location.href = "iniciar_sesion.html";
    }
});