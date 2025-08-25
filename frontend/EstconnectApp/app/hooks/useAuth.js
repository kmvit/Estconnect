import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверяем токен и загружаем данные пользователя
  const checkAuth = async () => {
    try {
      const token = await apiClient.getToken();
      if (token) {
        const profileData = await apiClient.getProfile();
        setUser(profileData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Ошибка проверки аутентификации:', error);
      setUser(null);
      setIsAuthenticated(false);
      // Удаляем недействительный токен
      await apiClient.removeToken();
    } finally {
      setLoading(false);
    }
  };

  // Вход в систему
  const login = async (credentials) => {
    const response = await apiClient.login(credentials);
    if (response.token) {
      await apiClient.setToken(response.token);
      await checkAuth();
    }
    return response;
  };

  // Выход из системы
  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Обновляем данные пользователя
  const updateUser = (userData) => {
    setUser(userData);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuth
  };
};
