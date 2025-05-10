// Configuration Firebase
const firebaseConfig = {
  // TODO: Remplacer par vos propres configurations Firebase
  apiKey: "AIzaSyCBGHV3fJc6ziwWeMrC6x4NQwVQIHNfh_Y",
  authDomain: "tcc-app-9be0c.firebaseapp.com",
  projectId: "tcc-app-9be0c",
  storageBucket: "tcc-app-9be0c.firebasestorage.app",
  messagingSenderId: "653275556191",
  appId: "G-KVXNE2VVM0"
};

// Initialisation de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

export async function getSynthesisFromBackend(conversationHistory) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversationHistory }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'appel à l\'API');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
} 

