import { StyleSheet } from 'react-native';
import { COLORS } from '../colors';
import { FONTS } from '../typography';
import { objectCardStyles } from '../components/objectCard';
import { buttonStyles } from '../components/buttons';

export const objectsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Стили для формы поиска недвижимости
  estateSearch: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 20,
    marginTop: 19,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  estateSearchTitle: {
    fontSize: 24,
    fontFamily: FONTS.univiaPro.book,
    color: COLORS.text,
    marginBottom: 10,
  },
  estateSearchFormItems: {
    marginBottom: 14,
  },
  estateSearchFormItem: {
    marginBottom: 16,
  },
  estateSearchFormItemSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.univiaPro.light,
    color: COLORS.breadcrumbs,
    marginBottom: 3,
  },
  estateSearchFormItemPrice: {
    flexDirection: 'row',
    gap: 12,
  },
  estateSearchFormActions: {
    flexDirection: 'column',
    gap: 15,
  },
  estateSearchAdvancedOpen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  estateSearchAdvancedOpenText: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.primary,
  },
  estateSearchFormActionsButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'space-between',
  },
  platformButtonOne: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 92,
    alignItems: 'center',
  },
  platformButtonOneText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.univiaPro.medium,
  },
  platformButtonTwo: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 92,
    alignItems: 'center',
  },
  platformButtonTwoText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: FONTS.univiaPro.medium,
  },
  
  // Стили для полей ввода
  input: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 8,
    height: 42,
    backgroundColor: COLORS.white,
    paddingHorizontal: 13,
    fontSize: 14,
    fontFamily: FONTS.univiaPro.light,
    color: '#000',
  },
  priceInput: {
    flex: 1,
  },
  
  // Стили для выпадающих списков
  searchDropdown: {
    width: 120,
  },
  searchDropdownButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 12,
  },
  searchDropdownButton: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.light,
    color: COLORS.text,
  },
  
  // Стили для списка объектов
  objectsList: {
    paddingBottom: 100,
  },
  
  // Используем общие стили карточек объектов
  objectCard: objectCardStyles.card,
  objectCardImage: objectCardStyles.cardImage,
  photoCount: objectCardStyles.photoCount,
  photoCountText: objectCardStyles.photoCountText,
  objectImage: objectCardStyles.image,
  objectCardContent: objectCardStyles.cardContent,
  favouriteButton: buttonStyles.favourite,
  favouriteButtonActive: buttonStyles.favouriteActive,
  objectTitle: objectCardStyles.title,
  objectLocation: objectCardStyles.location,
  objectLocationText: objectCardStyles.locationText,
  objectPrice: objectCardStyles.price,
  objectInfo: objectCardStyles.info,
  objectInfoItem: objectCardStyles.infoItem,
  objectInfoText: objectCardStyles.infoText,
  objectDescription: objectCardStyles.description,
  
  // Стили для пустого состояния
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: FONTS.univiaPro.medium,
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.gray,
    textAlign: 'center',
  },
  // Стили для панели действий
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: FONTS.univiaPro.medium,
    color: COLORS.primary,
  },
});
