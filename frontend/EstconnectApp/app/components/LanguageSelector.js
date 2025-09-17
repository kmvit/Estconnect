import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import LanguageIcon from './icons/LanguageIcon';
import { COLORS } from '../styles/colors';
import { FONTS } from '../styles/typography';
import { useLanguage } from '../contexts/LanguageContext';

const { width: screenWidth } = Dimensions.get('window');

const LanguageSelector = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);
  const { currentLanguage, availableLanguages, changeLanguage, getCurrentLanguageData } = useLanguage();

  const handlePress = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownPosition({
          top: pageY + height + 5, // 5px отступ от кнопки
          right: screenWidth - pageX - width, // Позиционируем справа
        });
        setIsVisible(true);
      });
    }
  };

  const handleLanguageSelect = async (languageCode) => {
    await changeLanguage(languageCode);
    setIsVisible(false);
  };

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity
      style={styles.languageItem}
      onPress={() => handleLanguageSelect(item.code)}
    >
      <Text style={[
        styles.languageItemText,
        item.code === currentLanguage && styles.languageItemTextActive
      ]}>
        {item.name}
      </Text>
      <Text style={styles.languageDisplayName}>
        {item.displayName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        ref={buttonRef}
        style={styles.languageButton}
        onPress={handlePress}
      >
        <LanguageIcon width={20} height={20} color={COLORS.text} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View
            style={[
              styles.dropdown,
              {
                top: dropdownPosition.top,
                right: dropdownPosition.right,
              }
            ]}
          >
            <FlatList
              data={availableLanguages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = {
  languageButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 120,
    maxWidth: 160,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  languageItemText: {
    fontSize: 14,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
    fontWeight: '500',
  },
  languageItemTextActive: {
    color: COLORS.primary,
    fontFamily: FONTS.univiaPro.bold,
  },
  languageDisplayName: {
    fontSize: 12,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.gray,
    marginLeft: 8,
  },
};

export default LanguageSelector;
