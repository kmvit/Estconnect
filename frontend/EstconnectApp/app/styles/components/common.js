import { StyleSheet } from 'react-native';
import { COLORS } from '../colors';
import { SPACING, GAPS } from '../spacing';
import { buttonStyles } from './buttons';
import { FONTS } from '../typography';

// Общие стили для переиспользования
export const commonStyles = StyleSheet.create({
  // Контейнеры
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  
  // Загрузка и ошибки
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  
  // Кнопки
  button: {
    ...buttonStyles.primary,
    width: 150,
  },
  buttonText: buttonStyles.primaryText,
  authButton: {
    width: 100,
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.text,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  authButtonText: {
    fontSize: 14,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  
  // Модальные окна
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 250,
    height: '100%',
    backgroundColor: COLORS.white,
    paddingTop: 60,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: -8,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Карточки
  card: {
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Переключатели языка
  languageSwitcher: {
    marginTop: 20,
  },
  languageLabel: {
    fontSize: 14,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
    marginBottom: 10,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: COLORS.white,
  },
  languageButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  languageButtonText: {
    fontSize: 12,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
  },
  languageButtonTextActive: {
    color: COLORS.white,
    fontFamily: FONTS.univiaPro.bold,
  },
  
  // Иконки
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 