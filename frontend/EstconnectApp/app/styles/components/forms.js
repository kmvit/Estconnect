import { StyleSheet } from 'react-native';
import { COLORS } from '../colors';

export const formStyles = StyleSheet.create({
  // Контейнер формы
  container: {
    gap: 12,
  },

  // Группа полей ввода
  inputGroup: {
    gap: 8,
  },

  // Метка поля
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.text,
  },

  // Поле ввода
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text,
  },

  // Поисковое поле
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text,
  },

  // Контейнер поиска
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Контейнер фильтров
  filtersContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Поля для цены
  priceInputs: {
    flexDirection: 'row',
    gap: 12,
  },

  priceInput: {
    flex: 1,
  },

  // Ошибка валидации
  error: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
  },

  // Успешная валидация
  success: {
    color: '#4caf50',
    fontSize: 12,
    marginTop: 4,
  },
});
