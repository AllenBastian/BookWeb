// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALYWGBArvc3uSqThtiFj3C-wAIx5SdP6M",
  authDomain: "bookweb-ec140.firebaseapp.com",
  projectId: "bookweb-ec140",
  storageBucket: "bookweb-ec140.appspot.com",
  messagingSenderId: "337804284110",
  appId: "1:337804284110:web:5a361571ba8c416ae6409f",
  measurementId: "G-M5YTJ4D33G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); 
const analytics = getAnalytics(app);
export { app,auth,db,storage,analytics };
