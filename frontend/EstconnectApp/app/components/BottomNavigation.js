import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import HomeIcon from './icons/HomeIcon';
import FinanceIcon from './icons/FinanceIcon';
import ViewIcon from './icons/ViewIcon';
import BuilderIcon from './icons/BuilderIcon';
import HelpIcon from './icons/HelpIcon';
import { COLORS } from '../styles/colors';

const BottomNavigation = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('home');

  const navigationItems = [
    {
      id: 'home',
      title: 'Главная',
      icon: HomeIcon,
      screen: 'Home',
    },
    {
      id: 'finance',
      title: 'Финансы',
      icon: FinanceIcon,
      screen: null, // Пока не реализовано
    },
    {
      id: 'view',
      title: 'Объекты',
      icon: ViewIcon,
      screen: null, // Пока не реализовано
    },
    {
      id: 'builder',
      title: 'Застройщики',
      icon: BuilderIcon,
      screen: null, // Пока не реализовано
    },
    {
      id: 'help',
      title: 'Поддержка',
      icon: HelpIcon,
      screen: null, // Пока не реализовано
    },
  ];

  const handleTabPress = (tabId) => {
    const item = navigationItems.find(item => item.id === tabId);
    setActiveTab(tabId);
    
    if (item.screen) {
      navigation.navigate(item.screen);
    } else {
      Alert.alert('Информация', `Экран "${item.title}" находится в разработке`);
    }
  };

  return (
    <View style={styles.container}>
      {navigationItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        
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