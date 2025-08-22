# StreeCare - Women's Health Platform
## Complete Project Structure & Changes Documentation

### 📋 Project Overview
**StreeCare** is a comprehensive full-stack women's health platform with AI chatbot integration, role-based access, and multi-language support.

### 🏗️ Technology Stack
- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS
- **Backend:** Node.js + Express.js + Firebase Firestore
- **Authentication:** JWT + bcrypt
- **AI Integration:** Google Gemini API
- **Deployment:** Render (Backend + Frontend)
- **Database:** Firebase Firestore

### 📁 Complete Project Structure
```
streecare-womens-health-platform/
├── frontend/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── ServerStatusBanner.tsx
│   │   ├── Sidebar.tsx
│   │   └── icons.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── I18nContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useTranslation.ts
│   ├── pages/
│   │   ├── AppointmentsPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── EmoTrackPage.tsx
│   │   ├── ForumPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SaathiChatPage.tsx
│   │   ├── SignupPage.tsx
│   │   └── TrackerPage.tsx
│   ├── services/
│   │   ├── geminiService.ts
│   │   └── mockData.ts
│   ├── utils/
│   │   └── translations.ts
│   ├── App.tsx
│   ├── config.ts
│   ├── index.html
│   ├── index.tsx
│   ├── types.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── netlify.toml
├── backend/
│   ├── config/
│   │   ├── firebase.js
│   │   └── secrets.js
│   ├── controllers/
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── forumController.js
│   │   ├── musicController.js
│   │   └── trackerController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── appointments.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── forum.js
│   │   ├── music.js
│   │   └── tracker.js
│   ├── scripts/
│   │   └── createTestUsers.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
├── render.yaml
├── metadata.json
└── README.md
```

### 🔧 Key Features Implemented
1. **Multi-language Support** (English, Hindi, Telugu)
2. **Role-based Authentication** (Patient/Doctor)
3. **AI Chatbot "Saathi"** - Health companion
4. **Appointment Booking System**
5. **Menstrual Health Tracker** with predictions
6. **Community Forum** with anonymous posting
7. **Emo Track** - Mood-based music recommendations
8. **Responsive Design** with TailwindCSS

### 🔄 Major Changes Made During Development

#### 1. **Environment Variables & Security**
- **Issue:** Vite environment variable access error
- **Fix:** Updated `geminiService.ts` to use `(import.meta as any).env?.VITE_GEMINI_API_KEY`
- **Security:** Removed Firebase credentials from `secrets.js`, added to `.gitignore`

#### 2. **Firebase Configuration**
- **Setup:** Firebase Admin SDK initialization
- **Database:** Firestore collections for users, appointments, forum, menstrual logs
- **Test Users:** Created script to add default test users
  - Patient: `patient@example.com` / `password123`
  - Doctor: `doctor@example.com` / `password123`

#### 3. **Backend API Endpoints**
```
/api/auth/register     - User registration
/api/auth/login        - User authentication  
/api/auth/profile      - Get user profile
/api/appointments      - CRUD operations
/api/forum             - Forum posts & comments
/api/menstrual         - Cycle tracking
/api/music             - Mood-based music
/api/dashboard         - Dashboard data
/api/health            - Health check
```

#### 4. **Deployment Configuration**
- **Render Setup:** Created `render.yaml` for both backend and frontend
- **Port Configuration:** Updated backend to use port 10000 for Render
- **Environment Variables:** Configured for production deployment

#### 5. **Git & Version Control**
- **Issue:** Firebase credentials exposed in Git history
- **Solution:** Added `backend/config/secrets.js` to `.gitignore`
- **Security:** Removed all sensitive data from repository

### 🚀 Deployment Instructions

#### For Google AI Studio / Cloud Run:
1. **Clone Repository:**
   ```bash
   git clone https://github.com/Mahesh0249/streecare-womens-health-platform.git
   cd streecare-womens-health-platform
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Variables (Backend):**
   ```env
   PORT=10000
   NODE_ENV=production
   GEMINI_API_KEY=your_gemini_api_key
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   ```

4. **Frontend Setup:**
   ```bash
   npm install
   npm run build
   ```

5. **Environment Variables (Frontend):**
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

#### Firebase Setup Required:
1. Create Firebase project
2. Enable Firestore Database
3. Generate service account key
4. Add Firebase credentials to environment variables
5. Run test user creation script: `node backend/scripts/createTestUsers.js`

### 📊 Database Schema (Firestore Collections)

#### Users Collection:
```json
{
  "name": "string",
  "email": "string", 
  "password": "string (hashed)",
  "role": "patient|doctor"
}
```

#### Appointments Collection:
```json
{
  "patient_id": "string",
  "doctor_id": "string", 
  "date": "timestamp",
  "time": "string",
  "status": "pending|confirmed|completed"
}
```

#### Forum Posts Collection:
```json
{
  "user_id": "string",
  "title": "string",
  "content": "string", 
  "created_at": "timestamp"
}
```

#### Menstrual Logs Collection:
```json
{
  "user_id": "string",
  "start_date": "string",
  "end_date": "string"
}
```

### 🔐 Security Measures Implemented
1. **JWT Authentication** with 7-day expiration
2. **Password Hashing** using bcrypt
3. **Environment Variables** for sensitive data
4. **CORS Configuration** for cross-origin requests
5. **Input Validation** on all API endpoints
6. **Firebase Security Rules** (to be configured)

### 🎯 Default Test Accounts
- **Patient Account:** 
  - Email: `patient@example.com`
  - Password: `password123`
- **Doctor Account:**
  - Email: `doctor@example.com` 
  - Password: `password123`

### 📝 Additional Notes
- **Line Ending Warnings:** Normal on Windows, doesn't affect functionality
- **Firestore Indexes:** May need to be created for complex queries
- **AI Integration:** Requires valid Gemini API key for chatbot functionality
- **Multi-language:** Supports English, Hindi, and Telugu translations

### 🔧 Build Commands
```bash
# Backend
cd backend && npm start

# Frontend  
npm run build
npm run preview

# Development
npm run dev (frontend)
npm run dev (backend with nodemon)
```

This documentation provides the complete structure and all changes made to build the StreeCare women's health platform.
