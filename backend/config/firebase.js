const admin = require('firebase-admin');
const { FIREBASE_SERVICE_ACCOUNT } = require('./secrets');

/**
 * Initializes the Firebase Admin SDK using the credentials 
 * provided in the `backend/config/secrets.js` file.
 */
try {
  if (!FIREBASE_SERVICE_ACCOUNT || !FIREBASE_SERVICE_ACCOUNT.project_id) {
    throw new Error('Firebase service account credentials are not set in backend/config/secrets.js');
  }

  admin.initializeApp({
    credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT)
  });

  console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error.message);
  // Exit the process if Firebase initialization fails, as the app cannot run without it.
  process.exit(1);
}

const db = admin.firestore();
module.exports = { admin, db };
