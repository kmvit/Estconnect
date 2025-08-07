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
}); 