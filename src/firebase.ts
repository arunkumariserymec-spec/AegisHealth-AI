import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer, collection, addDoc, getDocs, query, where, orderBy, setDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID if provided in config
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Mandatory Firestore Connection Verification
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified successfully');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore is offline. Checking network configuration.');
    }
    return false;
  }
}

// Automatically verify connection on module load
testFirestoreConnection();

// Google Sign-In with Firebase Auth
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    
    // Save or update user profile document in Firestore
    const userRef = doc(db, 'users', fbUser.uid);
    const userData = {
      id: fbUser.uid,
      name: fbUser.displayName || 'Google User',
      email: fbUser.email || '',
      role: 'user' as const,
      photoURL: fbUser.photoURL || '',
      lastLogin: new Date().toISOString()
    };
    await setDoc(userRef, userData, { merge: true });

    return {
      id: fbUser.uid,
      name: fbUser.displayName || 'Google User',
      email: fbUser.email || '',
      role: 'user' as const,
      preferredLanguage: 'en' as const,
      createdAt: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

// Sign Out
export async function logOutFromFirebase() {
  await fbSignOut(auth);
}

// Save consultation assessment record to Firestore
export async function saveConsultationToFirestore(consultationData: any) {
  try {
    const colRef = collection(db, 'consultations');
    const docRef = await addDoc(colRef, {
      ...consultationData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving consultation to Firestore:', error);
    return null;
  }
}

// Fetch user consultations from Firestore
export async function getUserConsultationsFromFirestore(userId: string) {
  try {
    const colRef = collection(db, 'consultations');
    const q = userId && userId !== 'guest'
      ? query(colRef, where('userId', '==', userId))
      : query(colRef);
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching consultations from Firestore:', error);
    return [];
  }
}
