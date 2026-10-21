import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth, Auth, signInAnonymously } from 'firebase/auth';
import { LearnerProfile } from '@/types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (typeof window !== 'undefined' && isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (err) {
    console.warn('[Firebase] Initialization error:', err);
  }
}

export { app, db, auth };

/**
 * Gets or creates a stable learner identifier for Firestore sync
 */
export const getStableLearnerId = (learnerName?: string): string => {
  if (typeof window === 'undefined') return 'server_session';

  const storedId = localStorage.getItem('firsttap_learner_uid');
  if (storedId) return storedId;

  const cleanName = (learnerName || 'learner')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 20);

  const newId = `${cleanName}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  localStorage.setItem('firsttap_learner_uid', newId);
  return newId;
};

/**
 * Persists learner profile and progress to Cloud Firestore
 */
export async function saveLearnerProfileToFirestore(
  profile: LearnerProfile
): Promise<boolean> {
  if (!db) {
    console.info('[Firebase] Firestore not initialized; using localStorage');
    return false;
  }

  try {
    const learnerId = getStableLearnerId(profile.name);
    const learnerDocRef = doc(db, 'learners', learnerId);

    // Prepare clean serializable object for Firestore
    const dataToSave = {
      name: profile.name,
      preferred_language: profile.preferred_language,
      phone_independent: profile.phone_independent,
      primary_category: profile.primary_category,
      learning_goal: profile.learning_goal || null,
      starting_learning_path: profile.starting_learning_path,
      assessment_status: profile.assessment_status || 'COMPLETED',
      assessment_completed_at: profile.assessment_completed_at || new Date().toISOString(),
      completion_reason: profile.completion_reason || null,
      whatsapp_progress: profile.whatsapp_progress || null,
      spam_progress: profile.spam_progress || null,
      business_progress: profile.business_progress || null,
      phone_settings_progress: profile.phone_settings_progress || null,
      last_active_at: new Date().toISOString(),
      updated_at: serverTimestamp(),
    };

    await setDoc(learnerDocRef, dataToSave, { merge: true });
    console.log('[Firebase] Learner profile saved to Firestore:', learnerId);
    return true;
  } catch (err: unknown) {
    console.warn('[Firebase] Could not save to Firestore (will use localStorage):', err);
    return false;
  }
}

/**
 * Fetches learner profile from Cloud Firestore
 */
export async function getLearnerProfileFromFirestore(
  learnerId?: string
): Promise<LearnerProfile | null> {
  if (!db) return null;

  try {
    const id = learnerId || getStableLearnerId();
    const learnerDocRef = doc(db, 'learners', id);
    const docSnap = await getDoc(learnerDocRef);

    if (docSnap.exists()) {
      return docSnap.data() as LearnerProfile;
    }
    return null;
  } catch (err) {
    console.warn('[Firebase] Could not fetch learner profile from Firestore:', err);
    return null;
  }
}

/**
 * Optional: Ensure anonymous authentication session for secure rule enforcement
 */
export async function ensureAnonymousAuth(): Promise<string | null> {
  if (!auth) return null;
  try {
    if (auth.currentUser) return auth.currentUser.uid;
    const cred = await signInAnonymously(auth);
    return cred.user.uid;
  } catch (err) {
    console.warn('[Firebase] Anonymous auth notice:', err);
    return null;
  }
}
