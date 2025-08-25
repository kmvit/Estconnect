// Шрифты
export const FONTS = {
  primary: 'Univia Pro',
  secondary: 'Open Sans',
  // Основные варианты Univia Pro
  univiaPro: {
    ultraLight: 'Univia Pro UltraLight',
    light: 'Univia Pro Light',
    regular: 'Univia Pro Regular',
    book: 'Univia Pro Book',
    bold: 'Univia Pro Bold',
    medium: 'Univia Pro Medium',
  },
  openSans: {
    regular: 'Open Sans',
    bold: 'Open Sans Bold',
  },
};

// Типографические стили для переиспользования
export const TYPOGRAPHY = {
  h1: {
    fontSize: 36,
    fontFamily: FONTS.univiaPro.medium,
    lineHeight: 44,
    color: '#292929',
  },
  h2: {
    fontSize: 28,
    fontFamily: FONTS.univiaPro.medium,
    color: '#292929',
  },
  h3: {
    fontSize: 24,
    fontFamily: FONTS.univiaPro.medium,
    color: '#292929',
  },
  body: {
    fontSize: 18,
    fontFamily: FONTS.univiaPro.light,
    lineHeight: 24,
    color: '#292929',
  },
  bodySmall: {
    fontSize: 16,
    fontFamily: FONTS.univiaPro.regular,
    color: '#292929',
  },
  caption: {
    fontSize: 14,
    fontFamily: FONTS.univiaPro.regular,
    color: '#292929',
    textTransform: 'uppercase',
  },
  button: {
    fontSize: 14,
    fontFamily: FONTS.univiaPro.regular,
    color: '#292929',
    textTransform: 'capitalize',
  },
  languageButton: {
    fontSize: 12,
    fontFamily: FONTS.univiaPro.regular,
    color: '#292929',
  },
};

// Выравнивание текста
export const TEXT_ALIGN = {
  center: {
    textAlign: 'center',
  },
  left: {
    textAlign: 'left',
  },
  right: {
    textAlign: 'right',
  },
};

// Дополнительные стили для разных весов Univia Pro
export const UNIVIA_PRO_STYLES = {
  light: {
    fontFamily: FONTS.univiaPro.regular,
  },
  regular: {
    fontFamily: FONTS.univiaPro.regular,
  },
  medium: {
    fontFamily: FONTS.univiaPro.medium,
  },
  bold: {
    fontFamily: FONTS.univiaPro.bold,
  },
  book: {
    fontFamily: FONTS.univiaPro.regular,
  },
}; 