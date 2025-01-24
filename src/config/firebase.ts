import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';

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

// Initialize Auth
export const auth = getAuth(app);

// Auth helper functions
export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

export default app; 


