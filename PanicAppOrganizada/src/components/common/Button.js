/**
 * 🔘 COMPONENTE BUTTON REUTILIZABLE
 * ==================================
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '../../styles/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  style = {},
  textStyle = {},
  ...props
}) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? colors.primary : colors.textWhite} 
        />
      ) : (
        <>
          {icon && icon}
          <Text style={textStyleCombined}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.buttonRadius,
    paddingHorizontal: spacing.md,
  },

  // Variantes
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  success: {
    backgroundColor: colors.success,
  },
  warning: {
    backgroundColor: colors.warning,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },

  // Tamaños
  small: {
    paddingVertical: spacing.xs,
    minHeight: 36,
  },
  medium: {
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  large: {
    paddingVertical: spacing.md,
    minHeight: 52,
  },

  // Estados
  disabled: {
    opacity: 0.5,
  },

  // Texto base
  text: {
    fontFamily: typography.fonts.medium,
    textAlign: 'center',
    fontWeight: typography.weights.medium,
  },

  // Texto por variante
  text_primary: {
    color: colors.textWhite,
  },
  text_secondary: {
    color: colors.textWhite,
  },
  text_success: {
    color: colors.textWhite,
  },
  text_warning: {
    color: colors.textWhite,
  },
  text_danger: {
    color: colors.textWhite,
  },
  text_outline: {
    color: colors.primary,
  },
  text_ghost: {
    color: colors.primary,
  },

  // Texto por tamaño
  text_small: {
    fontSize: typography.sizes.sm,
  },
  text_medium: {
    fontSize: typography.sizes.md,
  },
  text_large: {
    fontSize: typography.sizes.lg,
  },

  // Texto deshabilitado
  textDisabled: {
    opacity: 0.7,
  },
});

export default Button;
