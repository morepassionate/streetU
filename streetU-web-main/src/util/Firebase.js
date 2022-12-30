import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";  

const firebaseConfig = {
    apiKey: "AIzaSyAEuWco8RzXvKzHwcHk_1XTpVRvla3gSbI",
    authDomain: "streetu-6b8e9.firebaseapp.com",
    projectId: "streetu-6b8e9",
    storageBucket: "streetu-6b8e9.appspot.com",
    messagingSenderId: "475754977308",
    appId: "1:475754977308:web:4abc31d4ab5605a34067d9",
    measurementId: "G-S30CJ1MC04"
};

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore(); 
const storage = app.storage();
const auth = app.auth();

export { db, storage, auth };