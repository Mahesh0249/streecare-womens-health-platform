
export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isOffline: boolean;
  isCheckingStatus: boolean;
  retryConnection: () => Promise<void>;
}

export type Language = 'en' | 'te' | 'hi';

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface Appointment {
    id: string;
    patient_id?: string;
    doctor_id?: string;
    patient_name?: string; // For doctor's view
    doctor_name?: string; // For patient's view
    appointment_date: string;
    reason: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface ForumPost {
    id: string;
    title: string;
    content: string;
    created_at: string;
    // author_name is not included to maintain anonymity
}

export interface MenstrualLog {
    id: string;
    user_id: string;
    start_date: string;
    end_date: string;
}