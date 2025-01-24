import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTLiI7dvigIORum2VA00f6I88TDtDOrXI",
  authDomain: "tracker-5537d.firebaseapp.com",
  projectId: "tracker-5537d",
  storageBucket: "tracker-5537d.firebasestorage.app",
  messagingSenderId: "765570590056",
  appId: "1:765570590056:web:c3769a808cf35d291e22dd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app; 


