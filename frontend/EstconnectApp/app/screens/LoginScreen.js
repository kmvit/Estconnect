import React, { useState } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { authStyles } from '../styles/screens/auth';
import AuthContainer from '../components/AuthContainer';
import apiClient from '../api/client';
import { useAuth } from '../hooks/useAuth';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    setLoading(true);
    try {
      console.log('Отправка запроса на авторизацию...');
      const response = await login({
        username: username,
        password: password
      });
      
      console.log('Ответ от сервера:', response);
      
      if (response.token) {
        Alert.alert('Успех', 'Вход выполнен успешно', [
          { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]);
      } else {
        Alert.alert('Ошибка', 'Неверный ответ от сервера');
      }
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      Alert.alert('Ошибка', error.message || 'Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <ScrollView 
        contentContainerStyle={authStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={authStyles.content}>
          {/* Логотип */}
          <View style={authStyles.logoContainer}>
            <Image 
              source={require('../../assets/images/registration-logo.png')}
              style={authStyles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Заголовок */}
          <Text style={authStyles.title}>Авторизация</Text>

          {/* Форма */}
          <View style={authStyles.form}>
            <View style={authStyles.formItems}>
              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.input}
                  placeholder="Логин, телефон или email"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              
              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.input}
                  placeholder="Пароль"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
              
              <TouchableOpacity 
                style={authStyles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[authStyles.checkbox, rememberMe && authStyles.checkboxChecked]}>
                  {rememberMe && <Text style={authStyles.checkmark}>✓</Text>}
                </View>
                <Text style={authStyles.checkboxText}>Запомнить меня</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={authStyles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={authStyles.buttonText}>Войти</Text>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Ссылка на регистрацию */}
          <View style={authStyles.linkContainer}>
            <Text style={authStyles.checkboxText}>
              Нет аккаунта?{' '}
              <Text 
                style={authStyles.linkButtonText}
                onPress={() => navigation.navigate('Register')}
              >
                Зарегистрироваться
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Нижняя навигация */}
      <BottomNavigation navigation={navigation} />
    </View>
  );
};



export default LoginScreen;
