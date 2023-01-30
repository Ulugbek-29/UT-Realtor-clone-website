// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDenZjbnR-iPYSTWT6KtwrGDvbLjHgsK20",
  authDomain: "ut-realtor-clone-react-app.firebaseapp.com",
  projectId: "ut-realtor-clone-react-app",
  storageBucket: "ut-realtor-clone-react-app.appspot.com",
  messagingSenderId: "35394468510",
  appId: "1:35394468510:web:df31cd2944bf96cee0198f",
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();
