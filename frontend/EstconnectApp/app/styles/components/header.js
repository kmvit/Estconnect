import { StyleSheet } from 'react-native';
import { COLORS } from '../colors';

// Стили для компонента Header
export const headerStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLogo: {
    width: 143,
    height: 24,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    marginLeft: 4,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  profileText: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.text,
    marginRight: 4,
  },
  burger: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  burgerIcon: {
    width: 20,
    height: 20,
  },
  menuItems: {
    marginBottom: 35,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.text,
    textTransform: 'uppercase',
  },
  // Стили для выпадающего меню профиля
  profileDropdownOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  profileDropdown: {
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
  profileDropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profileDropdownItemText: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.text,
  },
  profileDropdownSeparator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 8,
  },
  logoutText: {
    color: '#e74c3c', // Красный цвет для кнопки выхода
  },
}); 