
import React, { createContext, useState, useCallback, ReactNode } from 'react';
import type { Language, I18nContextType } from '../types';
import { translations } from '../utils/translations';

const I18nContext = createContext<I18nContextType | undefined>(undefined);

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