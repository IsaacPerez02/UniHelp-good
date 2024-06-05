import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


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

document.getElementById('submit').addEventListener('click', function (event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const type = document.getElementById('type').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Agregar información adicional del usuario a Firestore
      return addDoc(collection(db, "user"), {
        nickname: username,
        email: email,
        type: type
      });
    })
    .then(() => {
      alert('Inicio de sesión exitoso');
      window.location.href = "dashbord.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error:', errorCode, errorMessage);
      alert(errorMessage);
    });
});