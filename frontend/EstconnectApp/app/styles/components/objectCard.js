import { StyleSheet } from 'react-native';
import { COLORS } from '../colors';
import { FONTS } from '../typography';

export const objectCardStyles = StyleSheet.create({
  // Общие стили для карточек объектов
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardImage: {
    position: 'relative',
    height: 289,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  photoCount: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    zIndex: 1,
  },
  photoCountText: {
    color: '#000',
    fontSize: 16,
    fontFamily: FONTS.univiaPro.light,
  },
  cardContent: {
    padding: 22,
    position: 'relative',
  },
  favouriteButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 2,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  favouriteButtonActive: {
    // Стили для активного состояния
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.univiaPro.regular,
    color: '#000',
    marginBottom: 10,
    lineHeight: 24,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  locationText: {
    fontSize: 16,
    color: COLORS.breadcrumbs,
    fontFamily: FONTS.univiaPro.light,
    flex: 1,
  },
  price: {
    fontSize: 28,
    fontFamily: FONTS.univiaPro.book,
    color: COLORS.text,
    marginBottom: 11,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 21,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    borderRadius: 8,
    backgroundColor: COLORS.blue,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 12,
    fontFamily: FONTS.univiaPro.regular,
    color: '#000',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.light,
    color: '#000',
    lineHeight: 20,
  },
});
