export const firebaseConfig = {
  apiKey: process.env['NX_FIREBASE_API_KEY'],
  authDomain: process.env['NX_FIREBASE_AUTH_DOMAIN'],
  databaseUrl: process.env['NX_FIREBASE_DATABASE_URL'],
  projectId: process.env['NX_FIREBASE_PROJECT_ID'],
  storageBucket: process.env['NX_FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: process.env['NX_FIREBASE_MESSAGING_SENDER_ID'],
  appId: process.env['NX_FIREBASE_APP_ID'],
  measurementId: process.env['NX_FIREBASE_MEASUREMENT_ID']
};
