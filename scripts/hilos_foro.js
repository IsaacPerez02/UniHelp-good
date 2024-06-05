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
const threadList = document.querySelector('.question-list');

// Función para cargar los hilos del foro desde Firestore
async function loadThreads() {
    const querySnapshot = await getDocs(collection(db, "foro"));
    
    querySnapshot.forEach((doc) => {
        const threadData = doc.data();
        
        const threadItem = document.createElement('div');
        threadItem.classList.add('question-item');

        const threadInfo = document.createElement('div');
        threadInfo.classList.add('question-info');

        const titleElement = document.createElement('h4');
        titleElement.textContent = threadData.title;

        const userElement = document.createElement('p');
        userElement.innerHTML = `Posted by <strong>${threadData.user}</strong>`;

        const textElement = document.createElement('p');
        textElement.textContent = threadData.text;

        const viewThreadLink = document.createElement('a');
        viewThreadLink.href = `thread.html?threadId=${doc.id}`;
        viewThreadLink.textContent = 'View Thread';
        viewThreadLink.classList.add('enter-btn');

        threadInfo.appendChild(titleElement);
        threadInfo.appendChild(userElement);
        threadInfo.appendChild(textElement);
        threadInfo.appendChild(viewThreadLink);

        threadItem.appendChild(threadInfo);

        threadList.appendChild(threadItem);
    });
}

// Llama a la función para cargar los hilos cuando la página se cargue
window.addEventListener('DOMContentLoaded', loadThreads);
