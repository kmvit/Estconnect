import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../colors';
import { MARGINS, HORIZONTAL_PADDING, VERTICAL_PADDING, GAPS } from '../spacing';

// Стили для экрана HomeScreen
export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  
  // Главный экран
  mainScreen: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING.screen,
    paddingVertical: VERTICAL_PADDING.screen,
    marginBottom: MARGINS.xl,
  },
  mainScreenInfo: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  mainScreenTitle: {
    fontSize: 36,
    fontWeight: '400',
    color: COLORS.text,
    marginBottom: MARGINS.bottom.large,
    lineHeight: 44,
    textAlign: 'center',
  },
  mainScreenText: {
    fontSize: 20,
    fontWeight: '400',
    color: COLORS.text,
    marginBottom: MARGINS.bottom.large,
    lineHeight: 26,
    textAlign: 'center',
  },
  mainScreenImageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  mainScreenImage: {
    width: '100%',
    height: 320,
  },
  
  // Текстовый блок
  textBox: {
    paddingHorizontal: HORIZONTAL_PADDING.screen,
    marginBottom: VERTICAL_PADDING.section,
  },
  textBoxTitle: {
    fontSize: 28,
    fontWeight: '400',
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: MARGINS.bottom.small,
  },
  textBoxText: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    color: COLORS.text,
    lineHeight: 24,
  },
  
  // Направления работы
  workAreas: {
    paddingHorizontal: HORIZONTAL_PADDING.screen,
    marginBottom: MARGINS.bottom.xxlarge,
  },
  workAreasTitle: {
    fontSize: 28,
    fontWeight: '400',
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: MARGINS.xl,
  },
  workAreasItems: {
    flexDirection: 'column',
    gap: 25,
    alignItems: 'center',
  },
  workAreaItem: {
    height: 305,
    maxWidth: 305,
    width: '100%',
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
  workAreaImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  workAreaTitle: {
    position: 'absolute',
    bottom: 30,
    left: 25,
    right: 25,
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.white,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  
  // Блок с призывом к регистрации
  authCta: {
    paddingHorizontal: HORIZONTAL_PADDING.screen,
    paddingVertical: MARGINS.bottom.xxlarge,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  authCtaTitle: {
    fontSize: 24,
    fontWeight: '400',
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: 20,
    maxWidth: 300,
  },
  authCtaButtons: {
    flexDirection: 'row',
    gap: 3,
  },
  authButton: {
    width: 150,
  },
}); 