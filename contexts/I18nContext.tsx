
import React, { createContext, useState, useCallback, ReactNode } from 'react';
import type { Language, I18nContextType } from '../types';
import { translations } from '../utils/translations';

// Provide a default value instead of undefined
const defaultContext: I18nContextType = {
    language: 'en',
    setLanguage: () => {},
    t: (key: string) => key
};

const I18nContext = createContext<I18nContextType>(defaultContext);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = useCallback((key: string): string => {
        return translations[language][key] || key;
    }, [language]);

    return (
        <I18nContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
};

export default I18nContext;