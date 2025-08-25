import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../colors';

export const supportStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
    paddingBottom: 100, // Место для BottomNavigation
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    minHeight: 300,
  },
  authMessage: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Univia Pro Regular',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'Univia Pro Regular',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Univia Pro Regular',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.borderRadius,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Univia Pro Medium',
  },

  // Header styles
  header: {
    marginBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    fontFamily: 'Univia Pro Bold',
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    minWidth: 160,
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Univia Pro Medium',
  },

  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 60,
    minHeight: 400,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Univia Pro Bold',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
    fontFamily: 'Univia Pro Regular',
  },

  // Tickets list styles - обновленные в соответствии с веб-версией
  ticketsContainer: {
    gap: 16,
    paddingBottom: 20,
  },
  ticketCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 120,
  },
  ticketHeader: {
    padding: 24,
    paddingBottom: 16,
  },
  ticketInfo: {
    gap: 8,
  },
  statusBadgeContainer: {
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.white,
    overflow: 'hidden',
    fontFamily: 'Univia Pro Medium',
  },
  ticketDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
    fontFamily: 'Univia Pro Regular',
  },
  ticketId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
    fontFamily: 'Univia Pro Bold',
  },
  ticketCategory: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F2F2F7',
    borderRadius: 6,
    fontSize: 14,
    color: '#48484A',
    marginBottom: 8,
    overflow: 'hidden',
    fontFamily: 'Univia Pro Medium',
  },
  lastMessageInfo: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 4,
    fontFamily: 'Univia Pro Medium',
  },
  lastMessage: {
    fontSize: 14,
    color: '#48484A',
    lineHeight: 20,
    fontFamily: 'Univia Pro Regular',
  },
  ticketFooter: {
    padding: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  viewButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44,
  },
  viewButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Univia Pro Medium',
  },

  // Ticket detail header styles
  ticketDetailHeader: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  ticketDetailInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Create ticket styles
  createHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  createHeaderTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'Univia Pro Bold',
  },
  formContainer: {
    gap: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    fontFamily: 'Univia Pro Bold',
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: SIZES.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    fontFamily: 'Univia Pro Medium',
  },
  categoryButtonTextActive: {
    color: COLORS.white,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 200,
    textAlignVertical: 'top',
    fontFamily: 'Univia Pro Regular',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Univia Pro Medium',
  },

  // Messages styles
  messagesContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 20, // Отступ для BottomNavigation
  },
  emptyMessages: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyMessagesText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'Univia Pro Regular',
  },
  messageContainer: {
    marginVertical: 8,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  operatorMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  operatorBubble: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
    fontFamily: 'Univia Pro Regular',
  },
  userMessageText: {
    color: COLORS.white,
  },
  operatorMessageText: {
    color: COLORS.text,
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.7,
    fontFamily: 'Univia Pro Regular',
  },
  userMessageTime: {
    color: COLORS.white,
    textAlign: 'right',
  },
  operatorMessageTime: {
    color: COLORS.gray,
  },

  // Input styles
  inputContainer: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: 16,
    paddingBottom: 20, // Дополнительный отступ для BottomNavigation
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    maxHeight: 100,
    minHeight: 44,
    fontFamily: 'Univia Pro Regular',
  },
  fileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray,
  },

  // Operator info styles
  operatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  operatorPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    overflow: 'hidden',
  },
  operatorPhotoImage: {
    width: '100%',
    height: '100%',
  },
  operatorPhotoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  operatorPhotoText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Univia Pro Bold',
  },
  operatorDetails: {
    flex: 1,
  },
  operatorName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
    fontFamily: 'Univia Pro Bold',
  },
  operatorRole: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: 'Univia Pro Regular',
  },

  // Date separator styles
  dateSeparator: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.gray,
    marginVertical: 16,
    fontFamily: 'Univia Pro Regular',
  },
});
