import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAeTzbRh5QOdL7nm5Zw48RDWqjwW9Z_UTk",
  authDomain: "emprestimo-406bc.firebaseapp.com",
  projectId: "emprestimo-406bc",
  storageBucket: "emprestimo-406bc.firebasestorage.app",
  messagingSenderId: "284659741462",
  appId: "1:284659741462:web:e56b8b7bd37460d3465637",
  measurementId: "G-1JL5YPGSXD"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, signInWithPopup };