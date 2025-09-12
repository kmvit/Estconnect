import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../colors';
import { MARGINS, HORIZONTAL_PADDING, VERTICAL_PADDING, GAPS } from '../spacing';
import { FONTS } from '../typography';

export const financeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  
  // Заголовок
  header: {
    paddingHorizontal: HORIZONTAL_PADDING.screen,
    paddingVertical: VERTICAL_PADDING.screen,
    marginBottom: MARGINS.large,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
    textAlign: 'center',
  },
  
  // Основной экран с балансом и подпиской
  mainScreen: {
    flexDirection: 'column',
    gap: 24,
    paddingHorizontal: HORIZONTAL_PADDING.screen,
    marginBottom: 42,
  },
  
  // Блок баланса
  balanceWrapper: {
    width: '100%',
    height: 192,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  balanceAmount: {
    fontSize: 43,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  balanceText: {
    fontSize: 18,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
    textAlign: 'center',
  },
  
  // Блок подписки
  subscriptionWrapper: {
    width: '100%',
    height: 192,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  subscriptionText: {
    fontSize: 18,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
    textAlign: 'center',
  },
  subscriptionDays: {
    fontSize: 43,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
    textAlign: 'center',
  },
  subscriptionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 11,
    paddingHorizontal: 47,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionButtonText: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.medium,
    color: COLORS.white,
  },
  
  // История операций
  operations: {
    paddingHorizontal: HORIZONTAL_PADDING.screen,
    marginBottom: 88,
  },
  operationsHeader: {
    marginBottom: 40,
  },
  operationsTitle: {
    fontSize: 24,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
  },
  operationsList: {
    gap: 0,
  },
  operationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 21,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 15,
  },
  operationDate: {
    flex: 1,
  },
  operationDateText: {
    fontSize: 8,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
  },
  operationType: {
    flex: 1,
  },
  operationTypeText: {
    fontSize: 7,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
  },
  operationAmount: {
    flex: 1,
  },
  operationAmountText: {
    fontSize: 10,
    fontFamily: FONTS.univiaPro.medium,
  },
  operationDescription: {
    flex: 2,
  },
  operationDescriptionText: {
    fontSize: 8,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
  },
  operationStatus: {
    flex: 1,
  },
  operationStatusText: {
    fontSize: 8,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
  },
  emptyOperations: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyOperationsText: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.gray,
    textAlign: 'center',
  },
  
  // Доступные тарифы
  pricingPlans: {
    paddingHorizontal: HORIZONTAL_PADDING.screen,
    marginBottom: 42,
  },
  pricingPlansTitle: {
    fontSize: 24,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  pricingPlansList: {
    gap: 30,
  },
  pricingPlanItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 45,
    paddingBottom: 35,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  pricingPlanInfo: {
    marginBottom: 20,
  },
  pricingPlanTitle: {
    fontSize: 20,
    fontFamily: FONTS.univiaPro.medium,
    color: COLORS.text,
    marginBottom: 10,
  },
  pricingPlanPrice: {
    fontSize: 24,
    fontFamily: FONTS.univiaPro.bold,
    color: COLORS.primary,
    marginBottom: 10,
  },
  pricingPlanDescription: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.gray,
    lineHeight: 22,
  },
  pricingPlanButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  pricingPlanButtonText: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.medium,
    color: COLORS.white,
  },
  
  // Форма создания счета
  invoiceForm: {
    paddingHorizontal: HORIZONTAL_PADDING.screen,
    marginBottom: 50,
  },
  invoiceFormHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  invoiceFormTitle: {
    fontSize: 24,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
    textAlign: 'center',
  },
  invoiceFormContent: {
    alignItems: 'center',
    gap: 20,
  },
  invoiceFormText: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  invoiceFormButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
  },

  // Модальное окно
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONTS.univiaPro.medium,
    color: COLORS.text,
  },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.gray,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 15,
  },

  // Поля формы
  formField: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.medium,
    color: COLORS.text,
    marginBottom: 8,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  dropdownButtonText: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.regular,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: FONTS.univiaPro.regular,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.medium,
    color: COLORS.gray,
  },
  submitButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.medium,
    color: COLORS.white,
  },
});
