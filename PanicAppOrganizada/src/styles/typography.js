/**
 * 📝 SISTEMA DE TIPOGRAFÍA
 * ========================
 */

import { Platform } from 'react-native';

export const typography = {
  // 📱 Familias de fuente
  fonts: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
    }),
  },

  // 📏 Tamaños
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    huge: 32,
  },

  // 📐 Alturas de línea
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // ⚖️ Pesos
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
};

export default typography;
