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

// Seleccionar elementos del DOM
const chatInput = document.querySelector('.chat-input input');
const chatMessages = document.querySelector('.chat-messages');

// Función para agregar un mensaje al chat
function addMessage(message, sender, username, messageTime) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    const avatarContainer = document.createElement('div');
    avatarContainer.classList.add('avatar-container');

    const avatar = document.createElement('img');
    avatar.src = sender === 'user' ? 'pictures/student.png' : 'pictures/logo.png';
    avatar.alt = 'Avatar';
    avatar.classList.add('user-avatar');

    // Agregar el nombre de usuario debajo del avatar
    const usernameElement = document.createElement('div');
    usernameElement.textContent = username;
    usernameElement.classList.add('username');

    avatarContainer.appendChild(avatar);
    avatarContainer.appendChild(usernameElement);

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.innerHTML = `<p>${message}</p><span class="timestamp">${messageTime}</span>`;

    messageElement.appendChild(avatarContainer);
    messageElement.appendChild(messageContent);

    chatMessages.appendChild(messageElement);
}


// Función para obtener la hora actual en formato HH:MM
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Función para cargar los mensajes desde Firestore
async function loadMessages() {
    const q = query(collection(db, "chats"), orderBy("date"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        if (doc.exists()) {
            const messageData = doc.data();
            const messageTime = messageData.date.toDate(); // Convertir la fecha de Firebase a objeto Date
            const messageTimeString = messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Formatear la hora a HH:MM
            const messageContent = messageData.mensaje; // Concatenar el mensaje y la hora
            addMessage(messageContent, 'user', messageData.user, messageTimeString);
        } else {
            console.log("No such document!");
        }
    });
}


// Función para enviar un mensaje
async function sendMessage() {
    const message = chatInput.value.trim();
    if (message !== '') {
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
                // Guardar el mensaje en la base de datos
                await addDoc(collection(db, "chats"), {
                    mensaje: message,
                    user: nickname,
                    date: timestamp
                });

                // Obtener la hora formateada
                const hours = timestamp.getHours().toString().padStart(2, '0');
                const minutes = timestamp.getMinutes().toString().padStart(2, '0');
                const messageTime = `${hours}:${minutes}`;

                // Imprimir el mensaje en el chat
                addMessage(message, 'user', nickname, messageTime);

                chatInput.value = ''; // Limpiar el campo de entrada después de enviar el mensaje
            } else {
                console.log("Nickname not found!");
            }
        } else {
            console.log("User not authenticated!");
        }
    }
}



// Event listener para enviar un mensaje cuando se presiona Enter
chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Event listener para enviar un mensaje cuando se hace clic en el botón de enviar
document.querySelector('.chat-input button').addEventListener('click', sendMessage);

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
