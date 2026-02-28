// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoFNGTYdcllvEYQ_ehH7s_6qY0VTUTcZo",
  authDomain: "anjal-ventures.firebaseapp.com",
  projectId: "anjal-ventures",
  storageBucket: "anjal-ventures.firebasestorage.app",
  messagingSenderId: "1013920405544",
  appId: "1:1013920405544:web:2fac6ea670fbce7e247d1d",
  measurementId: "G-JDBW9EWTGB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client-side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics };
