import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

const LANGUAGE_STORAGE_KEY = 'app_language';

const AVAILABLE_LANGUAGES = [
  { code: 'ru', name: 'RU', displayName: 'Русский' },
  { code: 'en', name: 'EN', displayName: 'English' },
  { code: 'th', name: 'TH', displayName: 'ไทย' },
  { code: 'zh-hans', name: 'CH', displayName: '中文' },
];

// Создаем контекст
const LanguageContext = createContext();

// Провайдер контекста
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('ru');
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка сохраненного языка при инициализации
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && AVAILABLE_LANGUAGES.some(lang => lang.code === savedLanguage)) {
        setCurrentLanguage(savedLanguage);
        // Устанавливаем язык в Django при загрузке приложения
        await apiClient.setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Ошибка загрузки языка:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (languageCode) => {
    try {
      if (AVAILABLE_LANGUAGES.some(lang => lang.code === languageCode)) {
        // Отправляем запрос на бэкенд для установки языка в Django сессию
        await apiClient.setLanguage(languageCode);
        
        // Обновляем локальное состояние
        setCurrentLanguage(languageCode);
        
        // Сохраняем в AsyncStorage
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
        
        console.log(`Язык изменен на: ${languageCode}`);
      } else {
        console.error('Неподдерживаемый код языка:', languageCode);
      }
    } catch (error) {
      console.error('Ошибка смены языка:', error);
    }
  };

  const getCurrentLanguageData = () => {
    return AVAILABLE_LANGUAGES.find(lang => lang.code === currentLanguage) || AVAILABLE_LANGUAGES[0];
  };

  const value = {
    currentLanguage,
    availableLanguages: AVAILABLE_LANGUAGES,
    changeLanguage,
    getCurrentLanguageData,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Хук для использования контекста
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage должен использоваться внутри LanguageProvider');
  }
  return context;
};
