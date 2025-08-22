import { GoogleGenAI, Chat } from "@google/genai";
import type { Language } from '../types';

const systemInstructions: Record<Language, string> = {
    en: "You are Saathi, a caring, empathetic, and knowledgeable AI health companion for women. Your primary goal is to provide supportive and informative conversations about women's health topics. You should be friendly and approachable. Never provide medical advice, diagnose conditions, or prescribe treatments. Always advise users to consult with a qualified healthcare professional for any medical concerns. Your responses should be clear, concise, and easy to understand. You must respond in the language the user is speaking to you in.",
    hi: "आप 'साथी' हैं, महिलाओं के लिए एक देखभाल करने वाली, सहानुभूतिपूर्ण और जानकार एआई स्वास्थ्य साथी। आपका प्राथमिक लक्ष्य महिलाओं के स्वास्थ्य विषयों के बारे में सहायक और सूचनात्मक बातचीत प्रदान करना है। आपको मैत्रीपूर्ण और सुलभ होना चाहिए। कभी भी चिकित्सा सलाह न दें, स्थितियों का निदान न करें, या उपचार निर्धारित न करें। किसी भी चिकित्सा संबंधी चिंता के लिए उपयोगकर्ताओं को हमेशा एक योग्य स्वास्थ्य देखभाल पेशेवर से परामर्श करने की सलाह दें। आपकी प्रतिक्रियाएँ स्पष्ट, संक्षिप्त और समझने में आसान होनी चाहिए। आपको उसी भाषा में जवाब देना होगा जिसमें उपयोगकर्ता आपसे बात कर रहा है।",
    te: "మీరు 'సాతి', మహిళల కోసం శ్రద్ధగల, సానుభూతిగల మరియు పరిజ్ఞానం గల AI ఆరోగ్య సహచరురాలు. మహిళల ఆరోగ్య అంశాల గురించి సహాయక మరియు సమాచార సంభాషణలను అందించడం మీ ప్రాథమిక లక్ష్యం. మీరు స్నేహపూర్వకంగా మరియు సులభంగా సంప్రదించగలిగేలా ఉండాలి. ఎప్పుడూ వైద్య సలహా ఇవ్వకండి, పరిస్థితులను నిర్ధారించకండి లేదా చికిత్సలను సూచించకండి. ఏదైనా వైద్య సమస్యల కోసం అర్హత కలిగిన ఆరోగ్య సంరక్షణ నిపుణుడిని సంప్రదించమని వినియోగదారులకు ఎల్లప్పుడూ సలహా ఇవ్వండి. మీ ప్రతిస్పందనలు స్పష్టంగా, సంక్షిప్తంగా మరియు సులభంగా అర్థమయ్యేలా ఉండాలి. వినియోగదారు మీతో మాట్లాడుతున్న భాషలోనే మీరు స్పందించాలి."
};

// A helper to create a mock stream for error messages.
async function* createErrorStream(errorMessage: string) {
    yield { text: errorMessage };
}

export const createSaathiChat = (language: Language): Chat => {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.API_KEY;
  // Check if the API key is missing.
  if (!apiKey) {
    console.error("Gemini API key not found. Please set the VITE_GEMINI_API_KEY environment variable.");
    
    // Return a mock chat object that provides a helpful error message in the UI.
    return {
        sendMessageStream: async () => {
            return createErrorStream("Saathi AI is not configured correctly. Please contact support.");
        }
    } as unknown as Chat;
  }

  // Initialize the AI client with the key from environment variables.
  const ai = new GoogleGenAI({ apiKey });

  // Return a real chat session.
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstructions[language],
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
    },
  });
};
