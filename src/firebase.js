import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJi6Oxdx9avFhuNGmqJlIcrMlAwY7uLH0",
  authDomain: "expense-tracker-8dcd2.firebaseapp.com",
  projectId: "expense-tracker-8dcd2",
  storageBucket: "expense-tracker-8dcd2.firebasestorage.app",
  messagingSenderId: "925200852208",
  appId: "1:925200852208:web:78646186e65b1ee4b94e35"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);