import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import BurgerIcon from './icons/BurgerIcon';
import CloseIcon from './icons/CloseIcon';
import Logo from './Logo';
import { COLORS } from '../styles/colors';
import { headerStyles as styles } from '../styles/components/header';
import { commonStyles } from '../styles/components/common';

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ru');

  const menuItems = [
    { title: 'О нас', url: '/about-us/' },
    { title: 'О продукте', url: '/about-product/' },
    { title: 'Почему мы', url: '/why-we/' },
    { title: 'Контакты', url: '/contacts/' },
  ];

  const languages = [
    { code: 'ru', name: 'RU' },
    { code: 'en', name: 'EN' },
    { code: 'th', name: 'TH' },
    { code: 'zh-hans', name: 'CH' },
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

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    Alert.alert('Информация', `Язык изменен на: ${language}`);
  };

  const handleLoginPress = () => {
    Alert.alert('Информация', 'Переход на страницу входа');
  };

  return (
    <View style={styles.header}>
      {/* Логотип */}
      <View style={styles.headerLogo}>
        <TouchableOpacity onPress={() => Alert.alert('Информация', 'Переход на главную')}>
          <Logo width={143} height={24} />
        </TouchableOpacity>
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
    </View>
  );
};

export default Header; 