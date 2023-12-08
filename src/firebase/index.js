// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBiiGQt2-NIOQeGM_FL8X4deHUGrpDnCI",
  authDomain: "musicapp-5a4aa.firebaseapp.com",
  projectId: "musicapp-5a4aa",
  storageBucket: "musicapp-5a4aa.appspot.com",
  messagingSenderId: "881607677827",
  appId: "1:881607677827:web:b5e27bbaac5ee686b0c8b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth }