import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBrLzdXDU03rwIWBu7hb232ClRzlXLG5qU",
    authDomain: "commerce-f8062.firebaseapp.com",
    databaseURL: "https://commerce-f8062.firebaseio.com",
    projectId: "commerce-f8062",
    storageBucket: "commerce-f8062.appspot.com",
    messagingSenderId: "127798354740",
    appId: "1:127798354740:web:20163804075eb5116dfb61",
    measurementId: "G-TS2MXSSW04"
  };

// Initialize Firebase
// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
const db = getFirestore(app);

console.log('Firebase initialized successfully without firestore')
export { app,db};