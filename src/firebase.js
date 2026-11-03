import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  limit
} from "firebase/firestore";

// Firebase credentials from environment variables (.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

const isConfigured = Boolean(
  firebaseConfig.projectId && 
  firebaseConfig.apiKey && 
  !firebaseConfig.projectId.includes("your_project")
);

const isDev = import.meta.env.DEV;

let db = null;
if (isConfigured) {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
  } catch (err) {
    console.error("Firebase initialization failed:", err);
  }
}

// Local mock storage key ONLY for local development before Firebase is configured
const LOCAL_STORAGE_REVIEWS_KEY = "pranayflix_fan_reviews_v1";

const DEFAULT_DEV_REVIEWS = [
  {
    id: "seed-1",
    name: "Janmesh Roida",
    stars: 5,
    message: "10/10 masterclass of chaos and heart. Season 20 is already breaking records. Happy Birthday Pranay! ❤️",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "seed-2",
    name: "Aryan Sharma",
    stars: 5,
    message: "Still waiting for him to reach in '5 minutes' but the show is a certified blockbuster! 🍿",
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: "seed-3",
    name: "Tanvi Deshmukh",
    stars: 5,
    message: "Happy 20th Birthday! May your Season 20 be full of happiness, good health, and on-time replies! ✨",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

export function getLocalReviews() {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    if (!stored) {
      localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(DEFAULT_DEV_REVIEWS));
      return DEFAULT_DEV_REVIEWS;
    }
    return JSON.parse(stored);
  } catch {
    return DEFAULT_DEV_REVIEWS;
  }
}

/**
 * Subscribes to real-time reviews from Cloud Firestore (or local dev storage).
 * Callback receives the array of reviews.
 * Optional onStatus receives sync state: { mode: 'cloud' | 'local', connected: boolean }
 */
export function subscribeToReviews(callback, onStatus) {
  if (db) {
    try {
      const q = query(
        collection(db, "reviews"),
        orderBy("createdAt", "desc"),
        limit(100)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            list.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString()
            });
          });
          callback(list);
          if (onStatus) {
            onStatus({ mode: 'cloud', connected: true, total: list.length });
          }
        },
        (err) => {
          console.error("Firestore real-time listener error:", err);
          if (isDev) {
            console.warn("Falling back to local development storage");
            callback(getLocalReviews());
            if (onStatus) onStatus({ mode: 'local', connected: true });
          } else {
            if (onStatus) onStatus({ mode: 'cloud', connected: false, error: err.message });
          }
        }
      );
      return unsubscribe;
    } catch (e) {
      console.error("Error setting up Firestore listener:", e);
    }
  }

  // Fallback ONLY for local development when Firebase is not configured:
  if (isDev) {
    callback(getLocalReviews());
    if (onStatus) onStatus({ mode: 'local', connected: true });

    const handleStorage = (e) => {
      if (e.key === LOCAL_STORAGE_REVIEWS_KEY) {
        callback(getLocalReviews());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  } else {
    // In production without Firebase config:
    callback([]);
    if (onStatus) onStatus({ mode: 'cloud', connected: false, error: "Firebase credentials not configured" });
    return () => {};
  }
}

/**
 * Adds a new fan review to Cloud Firestore (or local store in dev).
 * Strictly validates fields to comply with firestore.rules:
 *  - name: 1 to 40 chars
 *  - stars: 4 or 5
 *  - message: 1 to 300 chars
 *  - createdAt: timestamp
 */
export async function addReview({ name, stars, message }) {
  const cleanName = (name || "Anonymous Friend").trim().slice(0, 40);
  const cleanMessage = (message || "").trim().slice(0, 300);
  const cleanStars = Number(stars) === 4 ? 4 : 5; // strictly 4 or 5

  if (!cleanName) throw new Error("Name is required");
  if (!cleanMessage) throw new Error("Message is required");

  if (db) {
    const docRef = await addDoc(collection(db, "reviews"), {
      name: cleanName,
      stars: cleanStars,
      message: cleanMessage,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, name: cleanName, stars: cleanStars, message: cleanMessage };
  }

  // Local development fallback
  if (isDev) {
    try {
      const current = getLocalReviews();
      const newEntry = {
        id: "local-" + Date.now(),
        name: cleanName,
        stars: cleanStars,
        message: cleanMessage,
        createdAt: new Date().toISOString()
      };
      const updated = [newEntry, ...(Array.isArray(current) ? current : [])];
      localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(updated));
      return newEntry;
    } catch (err) {
      console.warn("Local storage write error:", err);
      return {
        id: "mem-" + Date.now(),
        name: cleanName,
        stars: cleanStars,
        message: cleanMessage,
        createdAt: new Date().toISOString()
      };
    }
  }

  throw new Error("Cloud Firestore is not configured. Set Firebase credentials in .env.");
}

export { isConfigured as isFirebaseConfigured };
