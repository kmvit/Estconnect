import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  Modal,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import BurgerIcon from './icons/BurgerIcon';
import CloseIcon from './icons/CloseIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import LanguageSelector from './LanguageSelector';
import Logo from './Logo';
import { COLORS } from '../styles/colors';
import { headerStyles as styles } from '../styles/components/header';
import { commonStyles } from '../styles/components/common';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';



const { width: screenWidth } = Dimensions.get('window');

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const navigation = useNavigation();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { currentLanguage } = useLanguage();
  const profileButtonRef = useRef(null);
  const menuItems = [
    { title: 'О нас', url: '/about-us/' },
    { title: 'О продукте', url: '/about-product/' },
    { title: 'Почему мы', url: '/why-we/' },
    { title: 'Контакты', url: '/contacts/' },
  ];

  const handleMenuPress = () => {
    setMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  const handleMenuItemPress = (item) => {
    Alert.alert('Информация', `Переход на страницу: ${item.title}`);
    setMenuVisible(false);
  };

  const handleLoginPress = () => {
    Alert.alert('Информация', 'Переход на страницу входа');
  }

  const handleHomePress = () => {
    navigation.navigate('Home');
  };

  const handleProfilePress = () => {
    if (isAuthenticated) {
      // Показываем выпадающее меню для авторизованных пользователей
      if (profileButtonRef.current) {
        profileButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
          setDropdownPosition({
            top: pageY + height + 5,
            right: screenWidth - pageX - width,
          });
          setProfileDropdownVisible(true);
        });
      }
    } else {
      navigation.navigate('Login');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setProfileDropdownVisible(false);
      Alert.alert('Успех', 'Вы успешно вышли из системы', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      Alert.alert('Ошибка', 'Не удалось выйти из системы');
    }
  };

  const handleProfileMenuPress = () => {
    setProfileDropdownVisible(false);
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.header}>
      {/* Логотип */}
      <View style={styles.headerLogo}>
        <TouchableOpacity onPress={() => handleHomePress()}>
          <Logo width={143} height={24} />
        </TouchableOpacity>
      </View>
        <View style={styles.headerRight}>
          <LanguageSelector />
          <View style={styles.profileContainer}>
            <TouchableOpacity 
              ref={profileButtonRef}
              onPress={() => handleProfilePress()}
              style={styles.profileButton}
            >
              <Text style={styles.profileText}>
                {loading ? 'Загрузка...' : 
                 isAuthenticated && user ? 
                   (user.username || user.first_name || user.email || 'Пользователь') : 
                   'Вход'}
              </Text>
              {isAuthenticated && (
                <ChevronDownIcon width={12} height={12} color={COLORS.text} />
              )}
            </TouchableOpacity>
          </View>
        </View>

      {/* Временно скрыто: Бургер меню */}
      {/* <TouchableOpacity style={styles.burger} onPress={handleMenuPress}>
        <BurgerIcon width={22} height={22} color={COLORS.text} />
      </TouchableOpacity> */}

      {/* Временно скрыто: Модальное окно меню */}
      {/* <Modal
        visible={menuVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseMenu}
      >
                  <View style={commonStyles.modalOverlay}>
            <View style={commonStyles.menuContainer}>
            <TouchableOpacity style={commonStyles.closeButton} onPress={handleCloseMenu}>
              <CloseIcon width={20} height={20} color={COLORS.text} />
            </TouchableOpacity>

            <ScrollView style={styles.menuItems}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress(item)}
                >
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={commonStyles.authButton} onPress={handleLoginPress}>
              <Text style={commonStyles.authButtonText}>Вход</Text>
            </TouchableOpacity>

            <View style={commonStyles.languageSwitcher}>
              <Text style={commonStyles.languageLabel}>Язык:</Text>
              <View style={commonStyles.languageButtons}>
                {languages.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      commonStyles.languageButton,
                      selectedLanguage === lang.code && commonStyles.languageButtonActive
                    ]}
                    onPress={() => handleLanguageChange(lang.code)}
                  >
                    <Text style={[
                      commonStyles.languageButtonText,
                      selectedLanguage === lang.code && commonStyles.languageButtonTextActive
                    ]}>
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal> */}

      {/* Выпадающее меню профиля */}
      <Modal
        visible={profileDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setProfileDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.profileDropdownOverlay}
          activeOpacity={1}
          onPress={() => setProfileDropdownVisible(false)}
        >
          <View
            style={[
              styles.profileDropdown,
              {
                top: dropdownPosition.top,
                right: dropdownPosition.right,
              }
            ]}
          >
            <TouchableOpacity
              style={styles.profileDropdownItem}
              onPress={handleProfileMenuPress}
            >
              <Text style={styles.profileDropdownItemText}>Профиль</Text>
            </TouchableOpacity>
            <View style={styles.profileDropdownSeparator} />
            <TouchableOpacity
              style={styles.profileDropdownItem}
              onPress={handleLogout}
            >
              <Text style={[styles.profileDropdownItemText, styles.logoutText]}>Выход</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Header; 