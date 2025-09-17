import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import HomeIcon from './icons/HomeIcon';
import FinanceIcon from './icons/FinanceIcon';
import ViewIcon from './icons/ViewIcon';
import BuilderIcon from './icons/BuilderIcon';
import AgentIcon from './icons/AgentIcon';
import HelpIcon from './icons/HelpIcon';
import { COLORS } from '../styles/colors';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { useTrans } from '../hooks/useTrans';

const BottomNavigation = ({ navigation, activeTab = 'home' }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const { trans, loadTranslations } = useTrans();

  // Загружаем переводы при инициализации
  useEffect(() => {
    loadTranslations([
      'Главная',
      'Финансы',
      'Объекты',
      'Застройщики',
      'Агенты',
      'Поддержка',
      'Информация',
      'находится в разработке',
      'Экран',
    ]);
  }, [currentLanguage]);

  // Синхронизируем состояние при изменении activeTab
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  const navigationItems = [
    {
      id: 'home',
      title: trans('Главная'),
      icon: HomeIcon,
      screen: 'Home',
    },
    {
      id: 'finance',
      title: trans('Финансы'),
      icon: FinanceIcon,
      screen: 'Finance',
    },
    {
      id: 'view',
      title: trans('Объекты'),
      icon: ViewIcon,
      screen: 'Objects',
    },
    // Показываем каталог только для агентов и застройщиков
    ...(user?.role !== 'admin' ? [{
      id: 'catalog',
      title: user?.role === 'agent' ? trans('Застройщики') : trans('Агенты'),
      icon: user?.role === 'agent' ? BuilderIcon : AgentIcon,
      screen: 'Catalog',
    }] : []),
    {
      id: 'help',
      title: trans('Поддержка'),
      icon: HelpIcon,
      screen: 'Support',
    },
  ];

  const handleTabPress = (tabId) => {
    const item = navigationItems.find(item => item.id === tabId);
    setCurrentTab(tabId);
    
    if (item.screen) {
      navigation.navigate(item.screen);
    } else {
      Alert.alert(trans('Информация'), `${trans('Экран')} "${item.title}" ${trans('находится в разработке')}`);
    }
  };

  return (
    <View style={styles.container}>
      {navigationItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = currentTab === item.id;
        
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.tab}
            onPress={() => handleTabPress(item.id)}
          >
            <IconComponent
              width={24}
              height={24}
              color={isActive ? COLORS.primary : COLORS.text}
            />
            <Text style={[
              styles.tabText,
              isActive && styles.activeTabText
            ]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '400',
    color: COLORS.text,
    marginTop: 4,
    textAlign: 'center',
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default BottomNavigation; 