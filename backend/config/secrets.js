// backend/config/secrets.js

// --- ACTION REQUIRED ---
// This file centralizes all your backend secrets.
// You do not need a .env file with this setup.

// 1. JWT (JSON Web Token) Secret for User Authentication
// This can be any long, random, and secret string. It's used to sign user session tokens.
// You can generate a strong one here: https://www.lastpass.com/features/password-generator
const JWT_SECRET = "add random session token";
const JWT_EXPIRES_IN = "7d"; // How long a user's login session lasts.


// 2. Firebase Service Account Credentials
// This JSON key allows your backend server to securely connect to your Firebase project.
// HOW TO GET IT:
//   1. Go to your Firebase project settings -> Service accounts.
//   2. Click "Generate new private key" to download your service account JSON file.
//   3. Open the downloaded file, copy its ENTIRE content.
//   4. Paste the copied content to replace the placeholder object below.
// Firebase credentials will be set via environment variables in production
// For local development, you can add your Firebase service account JSON here
const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : {
      // Add your Firebase service account credentials here for local development
      // DO NOT commit real credentials to Git
    };


// --- DO NOT EDIT BELOW THIS LINE ---
module.exports = {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    FIREBASE_SERVICE_ACCOUNT,
};