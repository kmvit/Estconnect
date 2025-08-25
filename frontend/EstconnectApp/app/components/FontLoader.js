import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { COLORS } from '../styles/colors';

const FontLoader = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        console.log('Начинаем загрузку шрифтов...');
        
        await Font.loadAsync({
          'Univia Pro Regular': require('../../assets/fonts/UniviaPro-Regular.ttf'),
          'Univia Pro UltraLight': require('../../assets/fonts/UniviaPro-UltraLight.ttf'),
          'Univia Pro Light': require('../../assets/fonts/UniviaPro-Light.ttf'),
          'Univia Pro Book': require('../../assets/fonts/UniviaPro-Book.ttf'),
          'Univia Pro Medium': require('../../assets/fonts/UniviaPro-Medium.ttf'),
          'Univia Pro Bold': require('../../assets/fonts/UniviaPro-Bold.ttf'),
          'Open Sans': require('../../assets/fonts/OpenSans-Regular.ttf'),
          'Open Sans Bold': require('../../assets/fonts/OpenSans-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Ошибка загрузки шрифтов:', error);
        // В случае ошибки все равно показываем приложение
        setFontsLoaded(true);
      }
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 16, fontSize: 16, color: COLORS.text }}>Загрузка шрифтов...</Text>
      </View>
    );
  }

  return children;
};

export default FontLoader;
