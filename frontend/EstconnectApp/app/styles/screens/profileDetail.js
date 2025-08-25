import { StyleSheet } from 'react-native';
import { COLORS } from '../colors';
import { SPACING } from '../spacing';

export const profileDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  // Заголовок
  mainHeader: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    fontFamily: 'Univia Pro Bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 16,
    height: 16,
    marginRight: SPACING.xs,
    tintColor: COLORS.gray,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '350',
    color: COLORS.gray,
    fontFamily: 'Univia Pro Regular',
  },
  // Баннер с логотипом
  bannerSection: {
    marginBottom: SPACING.xl,
  },
  bannerContainer: {
    position: 'relative',
    height: 248,
    width: '100%',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  logoContainer: {
    position: 'absolute',
    left: '50%',
    bottom: -50, // Центрированное позиционирование как в мобильной версии
    width: 160,
    height: 160,
    transform: [{ translateX: -80 }], // Центрирование
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 80,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  favouriteButton: {
    position: 'absolute',
    right: SPACING.md,
    top: -70,
    width: 32,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favouriteIcon: {
    width: 24,
    height: 20,
  },
  // Информационные блоки
  infoSection: {
    paddingHorizontal: SPACING.lg,
    marginTop: 70, // Отступ сверху для аватара
    marginBottom: SPACING.xl,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '300',
    color: COLORS.text,
    marginBottom: 2,
    fontFamily: 'Univia Pro Regular',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.text,
    fontFamily: 'Univia Pro Medium',
  },
  // Время работы
  workingHoursSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  workingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#20BD00',
    marginRight: SPACING.sm,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.text,
    fontFamily: 'Univia Pro Medium',
  },
  workingSchedule: {
    padding: SPACING.lg,
  },
  scheduleItem: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    fontFamily: 'Univia Pro Regular',
  },
  scheduleTime: {
    fontWeight: '600',
    color: COLORS.primary,
    fontFamily: 'Univia Pro Bold',
  },
  // Социальные сети
  socialsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  socialsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  // Описание
  descriptionSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: COLORS.text,
    marginBottom: SPACING.md,
    fontFamily: 'Univia Pro Bold',
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.text,
    lineHeight: 24,
    fontFamily: 'Univia Pro Regular',
  },
  // Кнопки действий
  actionButtons: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  contactButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  projectsButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
});
