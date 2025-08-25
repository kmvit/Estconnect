import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../colors';
import { FONTS } from '../typography';
import { buttonStyles } from '../components/buttons';

const { width } = Dimensions.get('window');

export const objectDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  favouriteButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 80, // Отступ для нижнего меню
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    marginBottom: 20,
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  imageIndicatorActive: {
    backgroundColor: COLORS.white,
  },
  imageCounter: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  imageCounterText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.univiaPro.medium,
  },
  content: {
    padding: 16,
  },
  headerSection: {
    marginBottom: 20,
  },
  objectTitle: {
    fontSize: 36,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 44,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontFamily: FONTS.univiaPro.light,
    fontSize: 14,
    color: COLORS.gray,
    flex: 1,
  },
  priceText: {
    fontSize: 28,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
    marginBottom: 14,
  },

  infoSection: {
    marginBottom: 24,
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 30,
  },
  infoItemTitle: {
    fontFamily: FONTS.univiaPro.regular,
    width: 105,
    fontSize: 16,
    color: COLORS.gray,
  },
  infoItemText: {
    fontFamily: FONTS.univiaPro.regular,
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  actionsSection: {
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: COLORS.blue,
    borderRadius: 8,
    padding: 12,
    paddingHorizontal: 18,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 11,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    width: '100%',
  },
  mainButtonText: {
    fontSize: 13,
    color: COLORS.white,
    fontFamily: FONTS.univiaPro.regular,
  },

  // Информационные секции
  informationSection: {
    marginBottom: 42,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
    marginBottom: 25,
  },

  // Местонахождение
  locationContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
  },
  locationItems: {
    gap: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  locationItem: {
    padding: 16,
    paddingHorizontal: 19,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    width: 159,
    minHeight: 80,
    justifyContent: 'center',
  },
  locationItemTitle: {
    fontSize: 16,
    fontWeight: '300',
    fontFamily: FONTS.univiaPro.ultraLight,
    color: COLORS.text,
    marginBottom: 8,
  },
  locationItemText: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
    lineHeight: 20,
  },

  // Характеристики объекта
  characteristicsItems: {
    gap: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  characteristicsItem: {
    width: 159,
    minHeight: 80,
    padding: 16,
    paddingHorizontal: 19,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    justifyContent: 'center',
  },
  characteristicsIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characteristicsInfo: {
    flex: 1,
  },
  characteristicsTitle: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.ultraLight,
    color: COLORS.text,
    marginBottom: 8,
  },
  characteristicsText: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
    lineHeight: 20,
  },

  // Описание
  descriptionContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '300',
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'left',
  },
  descriptionDate: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.breadcrumbs,
    textAlign: 'left',
  },

  // Карта
  mapLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    margin: 0,
    marginBottom: 25,
  },
  mapLocationText: {
    fontSize: 16,
    color: COLORS.text,
  },
  mapContainer: {
    height: 400,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  mapLoadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.gray,
    fontFamily: FONTS.univiaPro.regular,
  },
  openMapsButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openMapsButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.univiaPro.medium,
  },

  // Другие объекты
  otherObjectsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  otherObjectsPlaceholder: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
  otherObjectsList: {
    paddingBottom: 20,
  },

});
