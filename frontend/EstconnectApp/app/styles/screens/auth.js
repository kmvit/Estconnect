import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../colors';

const { width, height } = Dimensions.get('window');

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: width > 480 ? 40 : 20,
    paddingVertical: 20,
  },
  content: {
    maxWidth: width > 480 ? 480 : 365,
    width: '100%',
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height > 667 ? 44 : 30,
  },
  logo: {
    width: 550,
  },
  title: {
    fontWeight: '500',
    fontSize: width > 480 ? 28 : 24,
    textTransform: 'uppercase',
    color: '#000',
    marginBottom: height > 667 ? 21 : 15,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  formItems: {
    marginBottom: height > 667 ? 16 : 12,
  },
  inputContainer: {
    marginBottom: height > 667 ? 16 : 12,
  },
  input: {
    width: '100%',
    padding: width > 480 ? 16 : 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: width > 480 ? 18 : 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: height > 667 ? 16 : 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: width > 480 ? 16 : 14,
    color: '#666',
    flex: 1,
    lineHeight: width > 480 ? 22 : 20,
  },
  linkText: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  button: {
    width: '100%',
    padding: width > 480 ? 18 : 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height > 667 ? 16 : 12,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: width > 480 ? 18 : 16,
    fontWeight: '500',
  },
  linkContainer: {
    alignItems: 'center',
  },
  linkButtonText: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  // Специфичные стили для регистрации
  roleSelection: {
    flexDirection: 'row',
    gap: width > 480 ? 15 : 11,
    marginBottom: height > 667 ? 15 : 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: height > 667 ? 18 : 15,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: height > 667 ? 86 : 70,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    elevation: 1,
  },
  roleButtonActive: {
    borderColor: COLORS.primary,
  },
  roleText: {
    fontWeight: '400',
    fontSize: width > 480 ? 18 : 16,
    color: '#000',
    marginTop: height > 667 ? 9 : 7,
  },
  roleTextActive: {
    color: COLORS.primary,
    fontWeight: '500',
  },
});
