import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../styles/colors';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { useNavigation } from '@react-navigation/native';
import { profileStyles as styles } from '../styles/screens/profile';
import ProfileIcon from '../components/icons/ProfileIcon';
import ContactIcon from '../components/icons/ContactIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import ApiClient from '../api/client';
import { useAuth } from '../hooks/useAuth';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated, logout } = useAuth();
  const [userData, setUserData] = useState({
    firstName: 'Иван',
    lastName: 'Иванов',
    companyName: 'ООО "Рога и Копыта"',
    language: 'Русский',
    phone: '+7 (999) 123-45-67',
    email: 'ivan.ivanov@example.com',
    preferredContact: 'Телефон',
  });

  const [subscriptionData, setSubscriptionData] = useState({
    plan: 'Business',
    validUntil: '05.12.2025',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const profileData = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        company_name: userData.companyName,
        language: userData.language === 'Русский' ? 'ru' : 'en',
        phone: userData.phone,
        email: userData.email,
        preferred_contact_method: userData.preferredContact === 'Электронная почта' ? 'email' : 'phone',
      };
      
      await ApiClient.updateProfile(profileData);
      Alert.alert('Успех', 'Изменения сохранены');
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error);
      setError('Не удалось сохранить изменения');
      Alert.alert('Ошибка', 'Не удалось сохранить изменения. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePlan = () => {
    Alert.alert('Информация', 'Функция изменения тарифа находится в разработке');
  };

  const handleExtendPlan = () => {
    Alert.alert('Информация', 'Функция продления тарифа находится в разработке');
  };

  const handleAddPhoto = () => {
    Alert.alert('Информация', 'Функция добавления фото находится в разработке');
  };

  const handleAddBanner = () => {
    Alert.alert('Информация', 'Функция добавления баннера находится в разработке');
  };

  // Загрузка данных профиля
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await ApiClient.getProfile();
      
      // Обновляем данные пользователя
      setUserData({
        firstName: profileData.first_name || userData.firstName,
        lastName: profileData.last_name || userData.lastName,
        companyName: profileData.company_name || userData.companyName,
        language: profileData.language === 'ru' ? 'Русский' : 'English',
        phone: profileData.phone || userData.phone,
        email: profileData.email || userData.email,
        preferredContact: profileData.preferred_contact_method === 'email' ? 'Электронная почта' : 'Телефон',
      });
      
      // Обновляем данные подписки
      if (profileData.subscription_type) {
        setSubscriptionData({
          plan: profileData.subscription_type,
          validUntil: profileData.subscription_end_date || '05.12.2025',
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
      if (error.message === 'Необходима авторизация') {
        setError('Для просмотра профиля необходимо войти в систему');
      } else {
        setError('Не удалось загрузить данные профиля');
      }
      // Используем данные по умолчанию при ошибке
    } finally {
      setLoading(false);
    }
  };

  // Загружаем профиль при монтировании компонента
  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Загрузка...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.demoText}>Отображаются демонстрационные данные</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
            <Text style={styles.retryButtonText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Баннер профиля */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('../../assets/images/main-screen-bg.png')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.bannerAddButton} onPress={handleAddBanner}>
            <Text style={styles.bannerAddText}>Добавить фото</Text>
          </TouchableOpacity>
          
          {/* Фото профиля */}
          <View style={styles.profilePhotoContainer}>
            <Image
              source={require('../../assets/images/profile_photo-picture.png')}
              style={styles.profilePhoto}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.profilePhotoAddButton} onPress={handleAddPhoto}>
              <Text style={styles.profilePhotoAddText}>Добавить фото</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Статусы */}
        <View style={styles.statusesContainer}>
          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>{subscriptionData.plan}</Text>
            <Text style={styles.statusText}>Текущий тариф</Text>
          </View>
          
          <View style={styles.statusCard}>
            <View style={styles.statusIconContainer}>
              <CalendarIcon width={48} height={48} color={COLORS.text} />
            </View>
            <Text style={styles.statusText}>Действителен до {subscriptionData.validUntil}</Text>
            <View style={styles.statusActions}>
              <TouchableOpacity style={styles.statusButtonSecondary} onPress={handleChangePlan}>
                <Text style={styles.statusButtonSecondaryText}>Изменить</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statusButtonPrimary} onPress={handleExtendPlan}>
                <Text style={styles.statusButtonPrimaryText}>Продлить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Личные данные */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <ProfileIcon width={32} height={32} color={COLORS.text} />
            </View>
            <Text style={styles.sectionTitle}>Личные данные</Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Имя</Text>
              <TextInput
                style={styles.textInput}
                value={userData.firstName}
                onChangeText={(text) => setUserData({...userData, firstName: text})}
                placeholder="Введите имя"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Фамилия</Text>
              <TextInput
                style={styles.textInput}
                value={userData.lastName}
                onChangeText={(text) => setUserData({...userData, lastName: text})}
                placeholder="Введите фамилию"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Компания</Text>
              <TextInput
                style={styles.textInput}
                value={userData.companyName}
                onChangeText={(text) => setUserData({...userData, companyName: text})}
                placeholder="Введите название компании"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Язык</Text>
              <TextInput
                style={styles.textInput}
                value={userData.language}
                onChangeText={(text) => setUserData({...userData, language: text})}
                placeholder="Выберите язык"
              />
            </View>
          </View>
        </View>

        {/* Контактная информация */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <ContactIcon width={32} height={32} color={COLORS.text} />
            </View>
            <Text style={styles.sectionTitle}>Контактная информация</Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Контактный номер</Text>
              <TextInput
                style={styles.textInput}
                value={userData.phone}
                onChangeText={(text) => setUserData({...userData, phone: text})}
                placeholder="Введите номер телефона"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Электронный адрес</Text>
              <TextInput
                style={styles.textInput}
                value={userData.email}
                onChangeText={(text) => setUserData({...userData, email: text})}
                placeholder="Введите email"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Предпочтительный канал связи</Text>
              <TextInput
                style={styles.textInput}
                value={userData.preferredContact}
                onChangeText={(text) => setUserData({...userData, preferredContact: text})}
                placeholder="Выберите канал связи"
              />
            </View>
          </View>
        </View>

        {/* Кнопка сохранения */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            onPress={handleSaveChanges}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>Сохранить изменения</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <BottomNavigation navigation={navigation} activeTab="home" />
    </View>
  );
};

export default ProfileScreen;