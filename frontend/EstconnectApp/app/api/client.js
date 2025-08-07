// Конфигурация API для разных окружений
const getApiUrl = () => {
  // Для разработки используем локальный сервер
  if (__DEV__) {
    return 'http://127.0.0.1:8000/api/v1';
  }
  // Для продакшена используйте ваш домен
  return 'https://estconnect.ru/api/v1';
};

const API_BASE_URL = getApiUrl();

class ApiClient {
  async get(endpoint) {
    try {
      console.log(`Making request to: ${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

  // Специальный метод для получения данных главной страницы
  async getHomePageData() {
    return this.get('/home/');
  }
}

export default new ApiClient();