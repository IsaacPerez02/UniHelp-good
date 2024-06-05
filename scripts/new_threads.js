import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, addDoc, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Seleccionar el formulario del DOM
const form = document.getElementById('new-question-form');

// Función para agregar una nueva pregunta a Firestore
async function addNewQuestion(title, text, date) {
    const user = auth.currentUser;

    if (user) {
        // Obtener el nickname del usuario
        const q = query(collection(db, "user"), where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        let nickname = "";
        querySnapshot.forEach((doc) => {
            if (doc.exists()) {
                nickname = doc.data().nickname;
            } else {
                console.log("No such document!");
            }
        });

        if (nickname) {
            // Guardar la pregunta en la base de datos
            await addDoc(collection(db, "foro"), {
                user: nickname,
                title: title,
                text: text,
                data: date
            });

            console.log('Pregunta agregada exitosamente.');
        } else {
            console.log("Nickname not found!");
        }
    } else {
        console.log("User not authenticated!");
    }
}

// Manejar el envío del formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = form.titulo.value.trim();
    const text = form.descripcion.value.trim();
    const date = new Date().toLocaleString(); // Obtener la fecha actual

    if (title !== '' && text !== '') {
        await addNewQuestion(title, text, date);
        window.location.href = "foro_calculo.html";
        // Resetea el formulario después de enviarlo
        form.reset();
    } else {
        console.log("Please fill in all fields.");
    }
});

// Escuchar cambios en la autenticación del usuario
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User authenticated:", user.email);
    } else {
        // No hay usuario autenticado, redirigir a la página de inicio de sesión
        window.location.href = "iniciar_sesion.html";
    }
});
