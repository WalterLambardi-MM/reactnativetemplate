import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDOPOoiuUzstU0dB34OtQlZiVjoIGXK1AQ',
  authDomain: 'poc-expo-project.firebaseapp.com',
  projectId: 'poc-expo-project',
  storageBucket: 'poc-expo-project.firebasestorage.app',
  messagingSenderId: '508664549153',
  appId: '1:508664549153:web:b8368d6448884755a67860',
  measurementId: 'G-4853C75V9T',
};

const initializeFirebase = () => {
  if (!firebaseConfig.apiKey) {
    console.warn('Firebase configuration is missing or incomplete');
    return null;
  }

  try {
    const app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
    return app;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return null;
  }
};

export const firebaseApp = initializeFirebase();

export const firebaseAuth = auth();

export const isFirebaseInitialized = () => {
  return !!firebaseApp;
};
