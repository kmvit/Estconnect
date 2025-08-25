import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import Button from '../components/Button';
import { COLORS } from '../styles/colors';
import { commonStyles } from '../styles/components/common';
import { profileDetailStyles as styles } from '../styles/screens/profileDetail';
import apiClient from '../api/client';
import CompanyTypeIcon from '../components/icons/CompanyTypeIcon';
import PlatformIcon from '../components/icons/PlatformIcon';
import WebsiteIcon from '../components/icons/WebsiteIcon';
import LanguageIcon from '../components/icons/LanguageIcon';
import TelegramIcon from '../components/icons/TelegramIcon';
import VKIcon from '../components/icons/VKIcon';
import InstagramIcon from '../components/icons/InstagramIcon';

const ProfileDetailScreen = ({ navigation, route }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);
  
  const { userId, type } = route.params;

  useEffect(() => {
    loadProfileData();
  }, [userId]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Используем методы API клиента в зависимости от типа
      const data = type === 'agents' 
        ? await apiClient.getAgent(userId)
        : await apiClient.getDeveloper(userId);
      
      setProfileData(data);
      setIsFavourite(data.is_favourite);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavourite = async () => {
    try {
      // Используем методы API клиента
      const data = type === 'agents' 
        ? await apiClient.toggleAgentFavourite(userId)
        : await apiClient.toggleDeveloperFavourite(userId);
      
      setIsFavourite(data.is_favourite);
    } catch (error) {
      console.error('Ошибка при добавлении/удалении из избранного:', error);
      Alert.alert('Ошибка', 'Не удалось обновить избранное');
    }
  };

  const handleViewProjects = () => {
    Alert.alert('Информация', 'Функция просмотра проектов в разработке');
  };

  if (loading) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={commonStyles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={commonStyles.errorContainer}>
        <Text style={commonStyles.errorText}>Не удалось загрузить данные профиля</Text>
        <Button title="Повторить" onPress={loadProfileData} style={commonStyles.button} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Заголовок */}
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>
            {profileData.company_name || profileData.username || 'Название не указано'}
          </Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color={COLORS.breadcrumbs} />
            <Text style={styles.locationText}>
              {(() => {
                const country = profileData.country_name || profileData.country;
                const city = profileData.city_name || profileData.city;
                
                if (!country && !city) return 'Не указана';
                if (country && city) return `${country}, ${city}`;
                if (country) return country;
                if (city) return city;
                return 'Не указана';
              })()}
            </Text>
          </View>
        </View>

        {/* Баннер с логотипом */}
        <View style={styles.bannerSection}>
          <View style={styles.bannerContainer}>
            <Image 
              source={profileData.image 
                ? { uri: profileData.image } 
                : require('../../assets/images/stroy-content-banner-img.png')
              }
              style={styles.bannerImage}
            />
            <View style={styles.logoContainer}>
              <Image 
                source={profileData.profile_photo 
                  ? { uri: profileData.profile_photo } 
                  : require('../../assets/images/stroy-content-logo.png')
                }
                style={styles.logoImage}
              />
            </View>
            <TouchableOpacity 
              style={styles.favouriteButton}
              onPress={handleToggleFavourite}
            >
              <Image 
                source={isFavourite 
                  ? require('../../assets/icons/favourites-icon.png')
                  : require('../../assets/icons/favourites-icon-outline.png')
                }
                style={styles.favouriteIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Информационные блоки */}
        <View style={styles.infoSection}>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <CompanyTypeIcon width={24} height={24} color={COLORS.text} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Тип компании</Text>
                <Text style={styles.infoValue}>
                  {profileData.role === 'developer' ? 'Застройщик' : 'Агент'}
                </Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <PlatformIcon width={24} height={24} color={COLORS.text} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>На платформе</Text>
                <Text style={styles.infoValue}>
                  {(() => {
                    if (!profileData.date_joined) return 'Не указана';
                    try {
                      const date = new Date(profileData.date_joined);
                      return date.toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      });
                    } catch (error) {
                      return 'Не указана';
                    }
                  })()}
                </Text>
              </View>
            </View>
            
            {profileData.website && (
              <View style={styles.infoItem}>
                <WebsiteIcon width={24} height={24} color={COLORS.text} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Веб-сайт</Text>
                  <Text style={styles.infoValue}>{profileData.website}</Text>
                </View>
              </View>
            )}
            
            <View style={styles.infoItem}>
              <LanguageIcon width={24} height={24} color={COLORS.text} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Язык общения</Text>
                <Text style={styles.infoValue}>
                  {profileData.language === 'en' ? 'English' : 'Русский'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Время работы */}
        <View style={styles.workingHoursSection}>
          <Text style={styles.sectionTitle}>Время работы</Text>
          <View style={styles.workingStatus}>
            <View style={styles.statusIndicator} />
            <Text style={styles.statusText}>Открыто сейчас</Text>
          </View>
          <View style={styles.workingSchedule}>
            <Text style={styles.scheduleItem}>Понедельник - пятница <Text style={styles.scheduleTime}>09:30 - 20:30</Text></Text>
            <Text style={styles.scheduleItem}>Суббота <Text style={styles.scheduleTime}>10:00 - 17:30</Text></Text>
            <Text style={styles.scheduleItem}>Воскресенье <Text style={styles.scheduleTime}>выходной</Text></Text>
          </View>
        </View>

        {/* Социальные сети */}
        <View style={styles.socialsSection}>
          <Text style={styles.sectionTitle}>Соц. сети</Text>
          <View style={styles.socialsGrid}>
            <TouchableOpacity style={styles.socialButton}>
              <TelegramIcon width={24} height={24} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <VKIcon width={24} height={24} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <InstagramIcon width={24} height={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Описание */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Описание</Text>
          <Text style={styles.descriptionText}>
            {profileData.description || 'Описание не указано'}
          </Text>
        </View>

        {/* Кнопки действий */}
        <View style={styles.actionButtons}>
          {profileData.role === 'developer' && (
            <Button 
              title="Посмотреть проекты"
              onPress={handleViewProjects}
              style={styles.projectsButton}
            />
          )}
        </View>
      </ScrollView>
      <BottomNavigation navigation={navigation} activeTab="catalog" />
    </View>
  );
};

export default ProfileDetailScreen;
