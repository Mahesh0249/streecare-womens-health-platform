// config.ts

// The Google Gemini API Key is now sourced from the `API_KEY` environment variable
// for better security practices. It is used in `services/geminiService.ts`.


// This is the base URL for your backend server.
// For local development, it's usually http://localhost:3001.
// When you deploy your backend, change this to your deployed server's URL.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
