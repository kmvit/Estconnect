import { StyleSheet } from 'react-native';
import { COLORS } from '../colors';
import { FONTS } from '../typography';

export const buttonStyles = StyleSheet.create({
  // Основная кнопка
  primary: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryText: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.white,
  },

  // Вторичная кнопка
  secondary: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.primary,
  },

  // Кнопка фильтра
  filter: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Кнопка сортировки
  sort: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Кнопка очистки фильтров
  clearFilters: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearFiltersText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.univiaPro.medium,
  },

  // Кнопка избранного
  favourite: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
    width: 32,
    height: 28,
  },
  favouriteActive: {
    // Стили для активного состояния
  },

  // Кнопка контакта
  contact: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.bold,
    color: COLORS.white,
  },
  contactSecondary: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  contactSecondaryText: {
    color: COLORS.primary,
  },
});
