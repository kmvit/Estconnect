import React, { useState } from 'react';
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
import AgentIcon from '../components/icons/AgentIcon';
import BuilderIcon from '../components/icons/BuilderIcon';
import BottomNavigation from '../components/BottomNavigation';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    role: 'developer'
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.username || !formData.email || !formData.password || !formData.password2) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    if (formData.password !== formData.password2) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
      return;
    }

    if (formData.password.length < 8) {
      Alert.alert('Ошибка', 'Пароль должен содержать минимум 8 символов');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Ошибка', 'Необходимо принять условия обработки персональных данных');
      return;
    }

    setLoading(true);
    try {
      // Здесь будет вызов API
      Alert.alert('Успех', 'Регистрация выполнена успешно', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      Alert.alert('Ошибка', 'Ошибка при регистрации. Возможно, пользователь уже существует.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <ScrollView 
        contentContainerStyle={[authStyles.scrollContent, { paddingTop: 50 }]}
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
          <Text style={authStyles.title}>Регистрация</Text>

          {/* Выбор роли */}
          <View style={authStyles.roleSelection}>
            <TouchableOpacity 
              style={[
                authStyles.roleButton, 
                formData.role === 'agent' && authStyles.roleButtonActive
              ]}
              onPress={() => setFormData({...formData, role: 'agent'})}
            >
              <AgentIcon 
                width={24}
                height={24}
                color={formData.role === 'agent' ? '#723cd9' : '#292929'}
              />
              <Text style={[
                authStyles.roleText,
                formData.role === 'agent' && authStyles.roleTextActive
              ]}>
                Агент
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                authStyles.roleButton, 
                formData.role === 'developer' && authStyles.roleButtonActive
              ]}
              onPress={() => setFormData({...formData, role: 'developer'})}
            >
              <BuilderIcon 
                width={24}
                height={24}
                color={formData.role === 'developer' ? '#723cd9' : '#292929'}
              />
              <Text style={[
                authStyles.roleText,
                formData.role === 'developer' && authStyles.roleTextActive
              ]}>
                Застройщик
              </Text>
            </TouchableOpacity>
          </View>

          {/* Форма */}
          <View style={authStyles.form}>
            <View style={authStyles.formItems}>
              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.input}
                  placeholder="Имя пользователя"
                  value={formData.username}
                  onChangeText={(text) => setFormData({...formData, username: text})}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.input}
                  placeholder="Email"
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
              </View>

              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.input}
                  placeholder="Пароль"
                  value={formData.password}
                  onChangeText={(text) => setFormData({...formData, password: text})}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.input}
                  placeholder="Подтвердите пароль"
                  value={formData.password2}
                  onChangeText={(text) => setFormData({...formData, password2: text})}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Согласие с условиями */}
            <TouchableOpacity 
              style={authStyles.checkboxContainer}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              <View style={[authStyles.checkbox, termsAccepted && authStyles.checkboxChecked]}>
                {termsAccepted && <Text style={authStyles.checkmark}>✓</Text>}
              </View>
              <Text style={authStyles.checkboxText}>
                Я ознакомлен и согласен{' '}
                <Text style={authStyles.linkText}>с правилами обработки персональных данных</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={authStyles.button}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={authStyles.buttonText}>Регистрация</Text>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Ссылка на вход */}
          <View style={authStyles.linkContainer}>
            <Text style={authStyles.checkboxText}>
              Уже есть аккаунт?{' '}
              <Text 
                style={authStyles.linkButtonText}
                onPress={() => navigation.navigate('Login')}
              >
                Войти
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

export default RegisterScreen;
