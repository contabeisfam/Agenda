// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Sua configuração (cole aqui)
const firebaseConfig = {
  apiKey: "AIzaSyCgvcsX9YxLf62qwLJnEyhXI5csg8N1Eug",
  authDomain: "agenda-ce81d.firebaseapp.com",
  projectId: "agenda-ce81d",
  storageBucket: "agenda-ce81d.firebasestorage.app",
  messagingSenderId: "1021906278741",
  appId: "1:1021906278741:web:b0bdb81580af897f3337dc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, deleteDoc, doc };
