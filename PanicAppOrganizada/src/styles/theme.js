/**
 * 🎨 TEMA UNIFICADO
 * =================
 */

import colors from './colors';
import typography from './typography';
import spacing from './spacing';

export const theme = {
  colors,
  typography,
  spacing,

  // 🎯 Componentes predefinidos
  components: {
    button: {
      primary: {
        backgroundColor: colors.primary,
        color: colors.textWhite,
        borderRadius: spacing.buttonRadius,
        padding: spacing.buttonPadding,
      },
      secondary: {
        backgroundColor: colors.secondary,
        color: colors.textWhite,
        borderRadius: spacing.buttonRadius,
        padding: spacing.buttonPadding,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
        color: colors.primary,
        borderRadius: spacing.buttonRadius,
        padding: spacing.buttonPadding,
      },
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: spacing.cardRadius,
      padding: spacing.cardPadding,
      shadowColor: colors.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.lighter,
      borderRadius: spacing.inputRadius,
      padding: spacing.inputPadding,
      fontSize: typography.sizes.md,
    },
  },

  // 📱 Pantallas
  screen: {
    padding: spacing.screenPadding,
    backgroundColor: colors.background,
  },
};

export default theme;
