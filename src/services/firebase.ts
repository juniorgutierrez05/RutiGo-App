/**
 * Firebase Service for RutiGo
 * 
 * Supports both full local offline/prototype execution with localStorage persistence
 * and structured connectors for Firebase Authentication and Cloud Firestore.
 * 
 * // TODO: conectar a Firestore
 * // Para conectar a Firebase en producción:
 * // 1. Crea un proyecto en https://console.firebase.google.com
 * // 2. Habilita Authentication (Email/Password + Google Provider)
 * // 3. Habilita Cloud Firestore en modo producción con las reglas indicadas
 * // 4. Instala 'firebase': npm install firebase
 * // 5. Agrega las variables de entorno en .env:
 * //    VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, etc.
 */

import { Place, Route, Review, NotificationItem, User } from '../types';
import { SEED_PLACES, SEED_ROUTES, SEED_REVIEWS, SEED_NOTIFICATIONS, INITIAL_USER } from './seedData';

// Local storage keys for state persistence
const STORAGE_KEYS = {
  USER: 'rutigo_user',
  PLACES: 'rutigo_places',
  ROUTES: 'rutigo_routes',
  REVIEWS: 'rutigo_reviews',
  NOTIFICATIONS: 'rutigo_notifications',
  SEARCH_HISTORY: 'rutigo_search_history',
};

const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) ||
  'http://localhost:3001';

type AuthApiResponse = {
  token: string;
  user: User;
};

// ============================================================================
// TODO: CONFIGURACIÓN OFICIAL DE FIREBASE (PRODUCCIÓN)
// ============================================================================
/*
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKey...",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rutigo-atlantico.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rutigo-atlantico",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rutigo-atlantico.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
*/

// ============================================================================
// PROTOTYPE ENGINE: LOCAL PERSISTENCE LAYER CONSTRUCTED TO MIRROR FIRESTORE
// ============================================================================

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving ${key} to storage:`, e);
  }
}

// ---------------------------
// 1. AUTHENTICATION SERVICE
// ---------------------------

export async function loginWithEmail(email: string, _password: string): Promise<User> {
  // TODO: conectar a Firebase Auth:
  // const userCredential = await signInWithEmailAndPassword(auth, email, password);
  // const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
  // return userDoc.data() as User;

  await new Promise((res) => setTimeout(res, 350));
  const currentUser = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);
  const updatedUser: User = {
    ...currentUser,
    email,
    name: email.split('@')[0].replace('.', ' ').replace(/^\w/, (c) => c.toUpperCase()),
  };
  setStored(STORAGE_KEYS.USER, updatedUser);
  return updatedUser;
}

export async function registerWithEmail(
  name: string,
  email: string,
  _password: string,
  homeCity: string
): Promise<User> {
  // TODO: conectar a Firebase Auth:
  // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // const newUser: User = { id: userCredential.user.uid, name, email, homeCity, savedRoutes: [], savedPlaces: [], createdAt: new Date().toISOString() };
  // await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
  // return newUser;

  await new Promise((res) => setTimeout(res, 350));
  const newUser: User = {
    id: `user_${Date.now()}`,
    name,
    email,
    homeCity: homeCity || 'Barranquilla',
    avatarUrl: INITIAL_USER.avatarUrl,
    savedRoutes: ['route_usiacuri'],
    savedPlaces: ['place_usiacuri_murales'],
    createdAt: new Date().toISOString(),
  };
  setStored(STORAGE_KEYS.USER, newUser);
  return newUser;
}

export async function loginWithGoogle(idToken: string): Promise<User> {
  const response = await fetch(`${API_URL}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error('No se pudo iniciar sesión con Google');
  }

  const data = (await response.json()) as AuthApiResponse;
  setStored(STORAGE_KEYS.USER, data.user);
  setStored('rutigo_auth_token', data.token);
  return data.user;
}

export async function logoutUser(): Promise<void> {
  // TODO: conectar a Firebase Auth:
  // await signOut(auth);
  setStored(STORAGE_KEYS.USER, null);
}

export function getCurrentUser(): User | null {
  return getStored<User | null>(STORAGE_KEYS.USER, INITIAL_USER);
}

// ---------------------------
// 2. FIRESTORE PLACES & ROUTES
// ---------------------------

export async function getPlaces(): Promise<Place[]> {
  // TODO: conectar a Firestore:
  // const querySnapshot = await getDocs(collection(db, 'places'));
  // return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Place));
  return getStored<Place[]>(STORAGE_KEYS.PLACES, SEED_PLACES);
}

export async function getRoutes(): Promise<Route[]> {
  // TODO: conectar a Firestore:
  // const querySnapshot = await getDocs(collection(db, 'routes'));
  // return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Route));
  return getStored<Route[]>(STORAGE_KEYS.ROUTES, SEED_ROUTES);
}

export async function getPlaceById(id: string): Promise<Place | undefined> {
  const places = await getPlaces();
  return places.find((p) => p.id === id);
}

export async function getRouteById(id: string): Promise<Route | undefined> {
  const routes = await getRoutes();
  return routes.find((r) => r.id === id);
}

// ---------------------------
// 3. FIRESTORE REVIEWS CRUD
// ---------------------------

export async function getReviews(placeOrRouteId?: string): Promise<Review[]> {
  // TODO: conectar a Firestore:
  // const q = placeOrRouteId
  //   ? query(collection(db, 'reviews'), where('placeId', '==', placeOrRouteId), orderBy('createdAt', 'desc'))
  //   : collection(db, 'reviews');
  // const snapshot = await getDocs(q);
  // return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Review));

  const allReviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  if (placeOrRouteId) {
    return allReviews.filter(
      (r) => r.placeId === placeOrRouteId || r.routeId === placeOrRouteId
    );
  }
  return allReviews;
}

export async function createReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  // TODO: conectar a Firestore:
  // const docRef = await addDoc(collection(db, 'reviews'), { ...reviewData, createdAt: new Date().toISOString() });
  // // Recalcular promedio de lugar:
  // await updateDoc(doc(db, 'places', reviewData.placeId), { avgRating: newAvg, reviewCount: count });

  const allReviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  const newReview: Review = {
    ...reviewData,
    id: `rev_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updatedReviews = [newReview, ...allReviews];
  setStored(STORAGE_KEYS.REVIEWS, updatedReviews);

  // Recalcular promedio y conteo de reseñas para el lugar
  if (newReview.placeId) {
    await recalculatePlaceRating(newReview.placeId, updatedReviews);
  }

  return newReview;
}

export async function updateReview(reviewId: string, rating: number, comment: string): Promise<Review> {
  // TODO: conectar a Firestore:
  // await updateDoc(doc(db, 'reviews', reviewId), { rating, comment });

  const allReviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  const index = allReviews.findIndex((r) => r.id === reviewId);
  if (index === -1) throw new Error('Reseña no encontrada');

  const updatedReview = {
    ...allReviews[index],
    rating,
    comment,
  };
  allReviews[index] = updatedReview;
  setStored(STORAGE_KEYS.REVIEWS, allReviews);

  if (updatedReview.placeId) {
    await recalculatePlaceRating(updatedReview.placeId, allReviews);
  }

  return updatedReview;
}

export async function deleteReview(reviewId: string): Promise<void> {
  // TODO: conectar a Firestore:
  // await deleteDoc(doc(db, 'reviews', reviewId));

  const allReviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  const target = allReviews.find((r) => r.id === reviewId);
  const updatedReviews = allReviews.filter((r) => r.id !== reviewId);
  setStored(STORAGE_KEYS.REVIEWS, updatedReviews);

  if (target?.placeId) {
    await recalculatePlaceRating(target.placeId, updatedReviews);
  }
}

async function recalculatePlaceRating(placeId: string, reviews: Review[]) {
  const placeReviews = reviews.filter((r) => r.placeId === placeId);
  const count = placeReviews.length;
  const avg =
    count === 0
      ? 5.0
      : Number((placeReviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1));

  const allPlaces = getStored<Place[]>(STORAGE_KEYS.PLACES, SEED_PLACES);
  const placeIndex = allPlaces.findIndex((p) => p.id === placeId);
  if (placeIndex !== -1) {
    allPlaces[placeIndex].avgRating = avg;
    allPlaces[placeIndex].reviewCount = count;
    setStored(STORAGE_KEYS.PLACES, allPlaces);
  }
}

// ---------------------------
// 4. FAVORITES PERSISTENCE
// ---------------------------

export async function toggleFavorite(
  type: 'route' | 'place',
  id: string,
  user: User
): Promise<User> {
  // TODO: conectar a Firestore:
  // const userRef = doc(db, 'users', user.id);
  // await updateDoc(userRef, { savedRoutes: arrayUnion(id) });
  
  const savedList = type === 'route' ? [...user.savedRoutes] : [...user.savedPlaces];
  const exists = savedList.includes(id);
  const updatedList = exists ? savedList.filter((item) => item !== id) : [...savedList, id];

  const updatedUser: User = {
    ...user,
    ...(type === 'route' ? { savedRoutes: updatedList } : { savedPlaces: updatedList }),
  };

  setStored(STORAGE_KEYS.USER, updatedUser);
  return updatedUser;
}

// ---------------------------
// 5. NOTIFICATIONS SERVICE
// ---------------------------

export async function getNotifications(): Promise<NotificationItem[]> {
  // TODO: conectar a Firestore:
  // const snapshot = await getDocs(query(collection(db, 'notifications'), where('userId', '==', user.id)));
  return getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const notifs = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
  setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
}
