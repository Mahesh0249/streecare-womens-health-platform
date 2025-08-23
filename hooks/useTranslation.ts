
import { useContext } from 'react';
import I18nContext from '../contexts/I18nContext';
import type { I18nContextType } from '../types';

export const useTranslation = (): I18nContextType => {
    const context = useContext(I18nContext);
    // Since we now have a default value, we don't need to check for undefined
    return context;
};