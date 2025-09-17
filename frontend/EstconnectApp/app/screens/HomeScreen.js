import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  ImageBackground,
  ActivityIndicator,
  Alert
} from 'react-native';
import Button from '../components/Button';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { useLanguage } from '../contexts/LanguageContext';
import apiClient from '../api/client';
import { COLORS } from '../styles/colors';
import { homeStyles as styles } from '../styles/screens/home';
import { commonStyles } from '../styles/components/common';

const HomeScreen = ({ navigation }) => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
     loadHomeData();
  }, [currentLanguage]); // Перезагружаем данные при смене языка

  const loadHomeData = async () => {
    try {
      const data = await apiClient.getHomePageData();
      setHomeData(data);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить данные главной страницы');
      console.error('Failed to load home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={commonStyles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  if (!homeData) {
    return (
      <View style={commonStyles.errorContainer}>
        <Text style={commonStyles.errorText}>Не удалось загрузить данные</Text>
        <Button title="Повторить" onPress={loadHomeData} style={commonStyles.button} />
      </View>
    );
  }

    return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Главный экран */}
        <View style={styles.mainScreen}>
          <View style={styles.mainScreenInfo}>
            <Text style={styles.mainScreenTitle}>
              {homeData.main_screen.title}
            </Text>
            <Text style={styles.mainScreenText}>
              {homeData.main_screen.text_line_1}{'\n'}
              {homeData.main_screen.text_line_2}
            </Text>
            <Button 
              title={homeData.main_screen.button_text}
              onPress={() => Alert.alert('Информация', 'Функция в разработке')}
              style={styles.mainScreenButton}
            />
          </View>
          {homeData.main_screen.image_url && (
            <View style={styles.mainScreenImageContainer}>
              <Image 
                source={{ uri: homeData.main_screen.image_url }}
                style={styles.mainScreenImage}
                resizeMode="contain"
              />
            </View>
          )}
        </View>

        {/* Блок EstConnect */}
        <View style={styles.textBox}>
          <Text style={styles.textBoxTitle}>{homeData.text_box.title}</Text>
          <Text style={styles.textBoxText}>{homeData.text_box.text}</Text>
        </View>

        {/* Три направления работы */}
        <View style={styles.workAreas}>
          <Text style={styles.workAreasTitle}>{homeData.work_areas.title}</Text>
          <View style={styles.workAreasItems}>
            {homeData.work_areas.items.map((item, index) => (
              <View key={index} style={styles.workAreaItem}>
                <Image 
                  source={{ uri: item.image_url }}
                  style={styles.workAreaImage}
                  resizeMode="cover"
                />
                <Text style={styles.workAreaTitle}>{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Блок с призывом к регистрации */}
        <ImageBackground 
          source={require('../../assets/images/auth-cta-bg_mobile.png')}
          style={styles.authCta}
          resizeMode="cover"
        >
          <Text style={styles.authCtaTitle}>{homeData.auth_cta.title}</Text>
          <View style={styles.authCtaButtons}>
            <Button 
              title={homeData.auth_cta.login_button_text}
              onPress={() => navigation.navigate('Login')}
              style={styles.authButton}
            />
            <Button 
              title={homeData.auth_cta.register_button_text}
              onPress={() => navigation.navigate('Register')}
              style={styles.authButton}
            />
          </View>
        </ImageBackground>
      </ScrollView>
      <BottomNavigation navigation={navigation} activeTab="home" />
    </View>
  );
};

export default HomeScreen;