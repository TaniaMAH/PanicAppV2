/**
 * 📱 COMPONENTE HEADER REUTILIZABLE
 * =================================
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { colors, spacing, typography } from '../../styles/theme';

const Header = ({
  title,
  subtitle = null,
  leftIcon = null,
  rightIcon = null,
  onLeftPress = null,
  onRightPress = null,
  backgroundColor = colors.dark,
  textColor = colors.textWhite,
  statusBarStyle = 'light-content',
  style = {},
}) => {
  return (
    <>
      <StatusBar backgroundColor={backgroundColor} barStyle={statusBarStyle} />
      <View style={[styles.container, { backgroundColor }, style]}>
        <View style={styles.content}>
          {/* Lado izquierdo */}
          <View style={styles.leftSection}>
            {leftIcon && (
              <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
                {leftIcon}
              </TouchableOpacity>
            )}
          </View>

          {/* Centro */}
          <View style={styles.centerSection}>
            <Text style={[styles.title, { color: textColor }]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: textColor }]}>{subtitle}</Text>
            )}
          </View>

          {/* Lado derecho */}
          <View style={styles.rightSection}>
            {rightIcon && (
              <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
                {rightIcon}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 3,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: spacing.xs,
    borderRadius: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fonts.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    fontFamily: typography.fonts.regular,
    textAlign: 'center',
    marginTop: spacing.xs / 2,
    opacity: 0.8,
  },
});

export default Header;
