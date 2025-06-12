/**
 * 🚨 BOTÓN DE EMERGENCIA PRINCIPAL
 * ================================
 */

import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../styles/theme';

const EmergencyButton = ({ 
  onPress, 
  disabled = false, 
  size = 200,
  animate = true 
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animate && !disabled) {
      // Animación de pulso
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      // Animación de brillo
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      );

      pulseAnimation.start();
      glowAnimation.start();

      return () => {
        pulseAnimation.stop();
        glowAnimation.stop();
      };
    }
  }, [animate, disabled, pulseAnim, glowAnim]);

  const buttonStyle = [
    styles.button,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    disabled && styles.disabled,
  ];

  const animatedStyle = {
    transform: [{ scale: pulseAnim }],
    shadowColor: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(231, 76, 60, 0.3)', 'rgba(231, 76, 60, 0.8)'],
    }),
  };

  return (
    <Animated.View style={[animatedStyle, styles.container]}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.icon}>🚨</Text>
        <Text style={styles.text}>EMERGENCIA</Text>
        <Text style={styles.subtext}>Presiona para activar</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: colors.emergency,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderWidth: 4,
    borderColor: colors.surface,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: colors.medium,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  text: {
    color: colors.textWhite,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fonts.bold,
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtext: {
    color: colors.textWhite,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.normal,
    fontFamily: typography.fonts.regular,
    textAlign: 'center',
    marginTop: spacing.xs,
    opacity: 0.9,
  },
});

export default EmergencyButton;
