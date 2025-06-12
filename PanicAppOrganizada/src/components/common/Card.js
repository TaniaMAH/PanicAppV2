/**
 * 🃏 COMPONENTE CARD REUTILIZABLE
 * ===============================
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../../styles/theme';

const Card = ({
  children,
  style = {},
  padding = 'medium',
  margin = 'medium',
  shadow = true,
  ...props
}) => {
  const cardStyle = [
    styles.base,
    shadow && styles.shadow,
    styles[`padding_${padding}`],
    styles[`margin_${margin}`],
    style,
  ];

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
  },

  shadow: {
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Padding variants
  padding_none: {
    padding: 0,
  },
  padding_small: {
    padding: spacing.sm,
  },
  padding_medium: {
    padding: spacing.md,
  },
  padding_large: {
    padding: spacing.lg,
  },

  // Margin variants
  margin_none: {
    margin: 0,
  },
  margin_small: {
    margin: spacing.sm,
  },
  margin_medium: {
    margin: spacing.md,
  },
  margin_large: {
    margin: spacing.lg,
  },
});

export default Card;
