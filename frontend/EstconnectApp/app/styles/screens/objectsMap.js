import { StyleSheet } from 'react-native';
import { COLORS } from '../colors';
import { SPACING, HORIZONTAL_PADDING, VERTICAL_PADDING } from '../spacing';
import { FONTS, TYPOGRAPHY } from '../typography';

export const objectsMapStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
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
    ...TYPOGRAPHY.body,
    color: COLORS.gray,
    marginTop: SPACING.small,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 10,
    paddingBottom: VERTICAL_PADDING,
    zIndex: 2,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.small,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.gray,
    textAlign: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  emptyIcon: {
    marginBottom: SPACING.large,
  },
  emptyText: {
    ...FONTS.h3,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.small,
  },
  emptySubtext: {
    ...TYPOGRAPHY.body,
    color: COLORS.gray,
    textAlign: 'center',
  },
});
