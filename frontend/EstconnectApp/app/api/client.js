import { DEV_IP, PROD_IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Конфигурация API для разных окружений
const getApiUrl = () => {
  // Для разработки используем локальный сервер
  if (__DEV__) {
    // Используем переменную окружения или fallback на IP адрес
    return DEV_IP || 'http://192.168.1.134:8000/api/v1';
  }
  // Для продакшена используйте ваш домен
  return PROD_IP || 'https://estconnect.ru/api/v1';
};

const API_BASE_URL = getApiUrl();

class ApiClient {
  constructor() {
    this.token = null;
  }

  async setToken(token) {
    this.token = token;
    await AsyncStorage.setItem('auth_token', token);
  }

  async getToken() {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('auth_token');
    }
    return this.token;
  }

  async removeToken() {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }
    
    return headers;
  }

  async get(endpoint) {
    try {
      console.log(`Making request to: ${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Методы для авторизации
  async register(userData) {
    return this.post('/users/auth/', userData);
  }

  async login(credentials) {
    return this.post('/users/auth/login/', credentials);
  }

  async logout() {
    const result = await this.post('/users/auth/logout/');
    await this.removeToken();
    return result;
  }

  // Методы для профиля
  async getProfile() {
    return this.get('/users/profile/');
  }

  async updateProfile(profileData) {
    return this.post('/users/profile/', profileData);
  }

  // Специальный метод для получения данных главной страницы
  async getHomePageData() {
    return this.get('/home/');
  }
}

export default new ApiClient();