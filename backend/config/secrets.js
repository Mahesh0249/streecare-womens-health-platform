// backend/config/secrets.js

// --- ACTION REQUIRED ---
// This file centralizes all your backend secrets.
// You do not need a .env file with this setup.

// 1. JWT (JSON Web Token) Secret for User Authentication
// This can be any long, random, and secret string. It's used to sign user session tokens.
// You can generate a strong one here: https://www.lastpass.com/features/password-generator
const JWT_SECRET =  "gHjKlPqRsTuVwXyZ123AbCdEfGhIjK456mN7oP8qR9sT0uV1wX2yZ3aB4c";

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
      
  "type": "service_account",
  "project_id": "shakthi-e6ecb",
  "private_key_id": "ec15b9b87debd0ed9bef0dd50d98074e24d63cca",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQDGbdn8j2ka11/m\nCO90UMvnGvgvgmC8Ns3dQLCJTSk+fRzn4FuBGRTUo4z69bwQ4ptk4EOnKm32Z6KJ\naV6O2cP+lmJ/X9Jlk/x1iJhHP1q2FE2YbDHcbzyb2Dus2jNMmR0XVKPObUn0vk5G\nk4ee2qKe79+iszduWt8KX47u7CK+/M5O8+44C3KqspIachTTTmacJye47ltnFXCG\nchIsMBtjH5D8gxxsC1leaHh+67fQhjPTPzMokVp8k9mR9HfkC6gj3XqQR7LF9vG5\nmkja4R6MbtC07KgZf5VKTmeWPK7jd4OaMxY/cQldaBYcVmscqWYQB1UdmlKcObXp\nGlOtsHTPAgMBAAECgf8Yj3D5LX5p7tdie2w7KxU77N2Cr9YIalzL/ky5JIOW2PED\nlICU7Ld9TeNxtipybn84ZFvsDGOugzSbBs9KENQ1YmAmje8GXtv/RUDU4P7II4W0\nWAutq/DUiwYRMS32pQxIz1dYjX6tBbcVjsnPk0+CH4aHE1OfEF9g/GtJqUDogS2k\nXOm9hDuVG2ykKTfuaIfxodkHEoNYLacrPNOtGx+uOp7UehbV2sN453jcxylu7BWC\nWjNyaxBdwh/vUdT4soLclbSyuYT+R18moB66JfXBoXvrc2Cac0PHcNUnD8g6kucL\nT3xZXKAolHVsu7qt1AEwqsmrnuGrLrFuOCC7ypkCgYEA/zJG62AXXswDoWInK1wU\nej5c8NDZbJy//EkW/1kKWaA4wYeS364VmN6V/JSTGOGc3dX0xwBv6s9rIpfrnArY\nK4RdmYUDSxD9Y7sNPEz/CbM1+tJuBsxJvk3el+alqEPFq2HKqcGnLcQcFvICeTjd\nNyKBK7eakKQwH3NYY/6ZMt0CgYEAxw3P9Rti3vpTHuLz5fJX1MfKc2odOc2M8X6h\npkWkazfpkEbP+IAxbPJok/0Q6x+r/+dvu8vTRSnVCrrBTrQ/Q2ltEK4TBBeN0YwE\n5DQr39aemGaUOeLr5vrWMGyOJcywyJ2qcWmOX4jN8Z9PkN1dgrT4DRuODK9KjcUW\nLLgQPZsCgYAofzIB6B3NTVLGKW1N1C7rtznIfVwDgFx3DKI5o0ehMWvQSlNka5vB\nxpDGpE0zhZn/GhTd/5PDD2dQ9grNmGr1fOvdkN4U631KdkSDbTSLtYS7aOlM6t5I\n9NJ+CHwBV7/mkn42siR1fsl2WrFJy1xPg4o8BcbhbSy10PgV5jEpgQKBgFdLWmju\norSQ6UUBWN7+IcCiAcoNvlVsLKR32WJ25j1THu3z8B7V8VcLFAvajsHeeOrYT2r3\nX2bUiqaS8lWWvKvOn1MSVCqWPc6o7jg6HQekMpc5XUXpm3UHiklgQhKXquvAIVBt\nb0+8SjztldI9ElZREPuGmww7D6IOzcO80PqDAoGBAJrLBFKz9Sn2TwCIaU+R+h/t\n0WpCX55XLdvtaffGemIwgqbp5/7K5K0K2LlljQkSiAFBveVyTZ4FA3kZwzpVYUXZ\nrs1he4xdrPYveghIHRJ47YovqONwIYEgu+3gicHTi+/uluoTl9vEcNhU5gU6t2VU\nVDC1R0j1oVvrr0JLv+aU\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@shakthi-e6ecb.iam.gserviceaccount.com",
  "client_id": "116173609847578805630",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40shakthi-e6ecb.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"

    };


// --- DO NOT EDIT BELOW THIS LINE ---
module.exports = {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    FIREBASE_SERVICE_ACCOUNT,
};
