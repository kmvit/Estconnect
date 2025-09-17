import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import apiClient from '../api/client';

// Кеш переводов для избежания повторных запросов
let translationsCache = {};
let currentCacheLanguage = null;

export const useTrans = () => {
  const { currentLanguage } = useLanguage();
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Функция для получения переводов с бэкенда (аналог {% trans %})
  const trans = (text) => {
    return translations[text] || text;
  };

  // Функция для загрузки переводов определенных строк
  const loadTranslations = async (stringsArray) => {
    // Сохраняем список строк для перезагрузки при смене языка
    setLastLoadedStrings(stringsArray);
    
    // Если язык не изменился и переводы уже есть в кеше, используем кеш
    if (currentCacheLanguage === currentLanguage && translationsCache[currentLanguage]) {
      const cachedTranslations = translationsCache[currentLanguage];
      const hasAllStrings = stringsArray.every(str => cachedTranslations[str]);
      
      if (hasAllStrings) {
        setTranslations(cachedTranslations);
        return;
      }
    }

    try {
      setIsLoading(true);
      
      // Отправляем запрос на бэкенд для получения переводов
      const response = await apiClient.translate(stringsArray);

      const newTranslations = response.translations;
      
      // Обновляем кеш
      if (!translationsCache[currentLanguage]) {
        translationsCache[currentLanguage] = {};
      }
      
      Object.assign(translationsCache[currentLanguage], newTranslations);
      currentCacheLanguage = currentLanguage;
      
      setTranslations(translationsCache[currentLanguage]);
    } catch (error) {
      console.error('Ошибка загрузки переводов:', error);
      // В случае ошибки используем исходные строки
      const fallbackTranslations = {};
      stringsArray.forEach(str => {
        fallbackTranslations[str] = str;
      });
      setTranslations(fallbackTranslations);
    } finally {
      setIsLoading(false);
    }
  };

  // Сохраняем последние загруженные строки для перезагрузки при смене языка
  const [lastLoadedStrings, setLastLoadedStrings] = useState([]);

  // Перезагружаем переводы при смене языка
  useEffect(() => {
    if (currentCacheLanguage !== currentLanguage && lastLoadedStrings.length > 0) {
      // Перезагружаем переводы для нового языка
      loadTranslations(lastLoadedStrings);
    }
  }, [currentLanguage]);

  return {
    trans, // Функция перевода (аналог {% trans %})
    loadTranslations, // Функция для загрузки переводов
    isLoading,
  };
};
