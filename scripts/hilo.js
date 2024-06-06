import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const responsesContainer = document.getElementById('responses-container');

// Función para agregar un mensaje al chat
function addMessage(message, username, messageTime) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('response-item');

    const messageContent = document.createElement('p');
    messageContent.innerHTML = `<strong>${username}:</strong> ${message}`;

    const messageTimestamp = document.createElement('p');
    messageTimestamp.textContent = `${messageTime}`;

    messageElement.appendChild(messageContent);
    messageElement.appendChild(messageTimestamp);

    responsesContainer.appendChild(messageElement); // Agregar mensaje al contenedor de respuestas
}

// Función para cargar los mensajes desde Firestore
async function loadMessages() {
    const q = query(collection(db, "message_foro"), orderBy("date"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        if (doc.exists()) {
            const messageData = doc.data();
            const messageTime = messageData.date.toDate(); // Convertir la fecha de Firebase a objeto Date
            const messageTimeString = messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Formatear la hora a HH:MM
            const messageContent = messageData.message; // Concatenar el mensaje y la hora
            addMessage(messageContent, messageData.nickname, messageTimeString);
        } else {
            console.log("No such document!");
        }
    });
}

// Función para enviar una respuesta
async function sendResponse() {
    const responseInput = document.getElementById('response-input');
    const responseMessage = responseInput.value.trim();

    if (responseMessage !== '') {
        const timestamp = new Date(); // Obtener el momento exacto

        // Obtener el usuario actual
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
                // Guardar la respuesta en la base de datos
                await addDoc(collection(db, "message_foro"), {
                    message: responseMessage,
                    user: nickname,
                    date: timestamp
                });

                // Obtener la hora formateada
                const hours = timestamp.getHours().toString().padStart(2, '0');
                const minutes = timestamp.getMinutes().toString().padStart(2, '0');
                const messageTime = `${hours}:${minutes}`;

                // Agregar la respuesta al contenedor de respuestas
                addMessage(responseMessage, nickname, messageTime);

                // Limpiar el campo de entrada después de enviar la respuesta
                responseInput.value = '';
            } else {
                console.log("Nickname not found!");
            }
        } else {
            console.log("User not authenticated!");
        }
    }
}

// Event listener para enviar una respuesta cuando se hace clic en el botón "Submit Response"
document.getElementById('submit-response-btn').addEventListener('click', sendResponse);


// Escuchar cambios en la autenticación del usuario
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Cargar mensajes existentes
        loadMessages();
    } else {
        // No hay usuario autenticado, redirigir a la página de inicio de sesión
        window.location.href = "iniciar_sesion.html";
    }
});