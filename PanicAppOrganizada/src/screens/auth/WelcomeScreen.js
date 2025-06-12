/**
 * 👋 PANTALLA DE BIENVENIDA
 * =========================
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import Button from '../../components/common/Button';
import InputField from '../../components/forms/InputField';
import { colors, spacing, typography } from '../../styles/theme';
import StorageService from '../../services/StorageService';

const WelcomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleContinue = async () => {
    if (!userName.trim()) {
      Alert.alert('⚠️ Atención', 'Por favor, escribe tu nombre.');
      return;
    }

    setLoading(true);

    try {
      // Guardar nombre de usuario
      await StorageService.saveUserName(userName.trim());
      
      // Marcar que ya vio la bienvenida
      await StorageService.save(StorageService.KEYS.ONBOARDING, true);

      // Navegar a la pantalla principal
      navigation.replace('Main');
    } catch (error) {
      console.error('Error guardando datos:', error);
      Alert.alert('Error', 'No se pudo guardar tu información. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar backgroundColor={colors.dark} barStyle="light-content" />
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.icon}>🆘</Text>
            <Text style={styles.title}>Bienvenido a PanicApp</Text>
            <Text style={styles.subtitle}>
              Tu red de seguridad personal siempre contigo
            </Text>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📍</Text>
              <Text style={styles.featureText}>Ubicación en tiempo real</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>👥</Text>
              <Text style={styles.featureText}>Contactos de emergencia</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🔐</Text>
              <Text style={styles.featureText}>Seguro con blockchain</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>¿Cómo te llamas?</Text>
            <InputField
              value={userName}
              onChangeText={setUserName}
              placeholder="Tu nombre completo"
              maxLength={50}
              autoCapitalize="words"
              style={styles.input}
              inputStyle={styles.inputText}
            />
          </View>

          {/* Button */}
          <Button
            title="Comenzar 🚀"
            onPress={handleContinue}
            disabled={!userName.trim() || loading}
            loading={loading}
            variant="primary"
            size="large"
            style={styles.button}
          />

          {/* Disclaimer */}
          <Text style={styles.disclaimer}>
            Al continuar, aceptas que esta app está diseñada para emergencias reales.
            Úsala responsablemente.
          </Text>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    padding: spacing.screenPadding,
  },
  content: {
    alignItems: 'center',
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  icon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.light,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Features
  features: {
    width: '100%',
    marginBottom: spacing.xxl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.md,
    borderRadius: spacing.cardRadius,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  featureText: {
    fontSize: typography.sizes.md,
    color: colors.textWhite,
    flex: 1,
  },

  // Form
  form: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  formTitle: {
    fontSize: typography.sizes.lg,
    color: colors.textWhite,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontWeight: typography.weights.semiBold,
  },
  input: {
    marginBottom: 0,
  },
  inputText: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: colors.textPrimary,
  },

  // Button
  button: {
    width: '100%',
    marginBottom: spacing.xl,
  },

  // Disclaimer
  disclaimer: {
    fontSize: typography.sizes.xs,
    color: colors.medium,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: spacing.lg,
  },
});

export default WelcomeScreen;
