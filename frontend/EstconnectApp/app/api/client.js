import { DEV_IP, PROD_IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Конфигурация API для разных окружений
const getApiUrl = () => {
  // Для разработки используем локальный сервер
  if (__DEV__) {
    // Используем переменную окружения или fallback на IP адрес
    return DEV_IP || 'http://192.168.1.138:8000/api/v1';
  }
  // Для продакшена используйте ваш домен
  return PROD_IP || 'https://estconnect.asia/api/v1';
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
        if (response.status === 401) {
          throw new Error('Необходима авторизация');
        }
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

  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
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

  async patch(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
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
    return this.post('/auth/', userData);
  }

  async login(credentials) {
    return this.post('/auth/login/', credentials);
  }

  async logout() {
    const result = await this.post('/auth/logout/');
    await this.removeToken();
    return result;
  }

  // Методы для профиля
  async getProfile() {
    return this.get('/profile/');
  }

  async updateProfile(profileData) {
    return this.patch('/profile/update_me/', profileData);
  }

  // Специальный метод для получения данных главной страницы
  async getHomePageData() {
    return this.get('/home/');
  }

  // Методы для работы с объектами
  async getObjects(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/objects/?${queryString}` : '/objects/';
    return this.get(endpoint);
  }

  async getObject(id) {
    return this.get(`/objects/${id}/`);
  }

  async toggleFavourite(objectId) {
    return this.post(`/objects/${objectId}/toggle_favourite/`);
  }

  async getFavourites() {
    return this.get('/objects/favourites/');
  }

  async getOtherObjects(objectId) {
    return this.get(`/objects/${objectId}/other_objects/`);
  }

  // Методы для работы с финансами
  async getFinanceData() {
    return this.get('/finance/');
  }

  async getFinancialOperations() {
    return this.get('/finance/operations/');
  }

  async getSubscriptionPlans() {
    return this.get('/subscriptions/plans/');
  }

  async createSubscription(planId) {
    return this.post(`/subscriptions/create/${planId}/`);
  }

  async extendSubscription() {
    return this.post('/subscriptions/extend/');
  }

  async createInvoice(invoiceData) {
    return this.post('/finance/invoice/', invoiceData);
  }

  // Методы для работы с каталогом агентов
  async getAgents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/users/agents/?${queryString}` : '/users/agents/';
    return this.get(endpoint);
  }

  async getAgent(id) {
    return this.get(`/users/${id}/`);
  }

  async toggleAgentFavourite(agentId) {
    return this.post(`/users/${agentId}/toggle_favourite/`);
  }

  // Методы для работы с каталогом застройщиков
  async getDevelopers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/users/developers/?${queryString}` : '/users/developers/';
    return this.get(endpoint);
  }

  async getDeveloper(id) {
    return this.get(`/users/${id}/`);
  }

  async toggleDeveloperFavourite(developerId) {
    return this.post(`/users/${developerId}/toggle_favourite/`);
  }

  // Методы для работы с поддержкой
  async getSupportTickets() {
    return this.get('/support/tickets/');
  }

  async getSupportTicket(ticketId) {
    return this.get(`/support/tickets/${ticketId}/`);
  }

  async createSupportTicket(ticketData) {
    return this.post('/support/tickets/', ticketData);
  }

  async sendSupportMessage(ticketId, messageData) {
    return this.post(`/support/tickets/${ticketId}/messages/`, messageData);
  }
}

export default new ApiClient();