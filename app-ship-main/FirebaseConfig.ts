import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from 'firebase/auth';

const getRequiredEnv = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const firebaseConfig = {
  apiKey: getRequiredEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getRequiredEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  databaseURL: getRequiredEnv('EXPO_PUBLIC_FIREBASE_DATABASE_URL'),
  projectId: getRequiredEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getRequiredEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getRequiredEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getRequiredEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const FIREBASE_APP = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

let authInstance: Auth | undefined;
let authWarningShown = false;

function createNativeAuth(): Auth {
  try {
    return initializeAuth(FIREBASE_APP, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code;
    if (code === 'auth/already-initialized') {
      return getAuth(FIREBASE_APP);
    }
    throw error;
  }
}

function createWebAuth(): Auth {
  return getAuth(FIREBASE_APP);
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    authInstance = Platform.OS === 'web' ? createWebAuth() : createNativeAuth();
  }
  return authInstance;
}

export function tryGetFirebaseAuth(): Auth | null {
  try {
    return getFirebaseAuth();
  } catch (error) {
    if (!authWarningShown) {
      authWarningShown = true;
      console.warn('Firebase auth is unavailable in this session.', error);
    }
    return null;
  }
}

/** @deprecated Prefer getFirebaseAuth() — kept for existing imports */
export const FIREBASE_AUTH: Auth = new Proxy({} as Auth, {
  get(_target, prop) {
    const auth = getFirebaseAuth();
    const value = Reflect.get(auth as object, prop, auth);
    return typeof value === 'function' ? value.bind(auth) : value;
  },
});
