/**
 * 🏠 PANTALLA PRINCIPAL
 * =====================
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmergencyButton from '../../components/emergency/EmergencyButton';
import { colors, spacing, typography } from '../../styles/theme';
import StorageService from '../../services/StorageService';
import ContactService from '../../services/ContactService';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [contactStats, setContactStats] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [emergencyDisabled, setEmergencyDisabled] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Cargar nombre de usuario
      const name = await StorageService.getUserName();
      setUserName(name || 'Usuario');

      // Cargar estadísticas de contactos
      const stats = await ContactService.getContactStats();
      setContactStats(stats);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const handleEmergencyPress = () => {
    if (!contactStats.isConfigured) {
      Alert.alert(
        '🚫 Sin contactos',
        'Debes agregar al menos un contacto de emergencia antes de activar una alerta.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Agregar Contactos', 
            onPress: () => navigation.navigate('Contacts') 
          },
        ]
      );
      return;
    }

    Alert.alert(
      '🚨 ¿Activar Alerta de Emergencia?',
      'Esto enviará tu ubicación a todos tus contactos de emergencia inmediatamente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'SÍ, ACTIVAR',
          style: 'destructive',
          onPress: () => navigation.navigate('Alert'),
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: '👥',
      title: 'Contactos',
      subtitle: `${contactStats.active || 0} configurados`,
      color: colors.secondary,
      screen: 'Contacts',
      badge: contactStats.active > 0 ? null : '!',
    },
    {
      icon: '📍',
      title: 'Ubicación',
      subtitle: 'Compartir ubicación actual',
      color: colors.success,
      screen: 'Location',
    },
    {
      icon: '🔄',
      title: 'Tiempo Real',
      subtitle: 'Seguimiento continuo',
      color: colors.warning,
      screen: 'RealTimeLocation',
    },
    {
      icon: '💰',
      title: 'Wallet',
      subtitle: 'Configuración blockchain',
      color: colors.info,
      screen: 'Wallet',
    },
  ];

  return (
    <View style={styles.container}>
      <Header
        title={`Hola, ${userName} 👋`}
        subtitle="Tu red de seguridad está activa"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Botón de emergencia */}
        <View style={styles.emergencyContainer}>
          <EmergencyButton
            onPress={handleEmergencyPress}
            disabled={emergencyDisabled}
            size={200}
            animate={true}
          />
        </View>

        {/* Estado de configuración */}
        {!contactStats.isConfigured && (
          <Card style={styles.warningCard}>
            <View style={styles.warningContent}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <View style={styles.warningText}>
                <Text style={styles.warningTitle}>Configuración incompleta</Text>
                <Text style={styles.warningSubtitle}>
                  Agrega contactos de emergencia para usar la aplicación
                </Text>
              </View>
            </View>
            <Button
              title="Configurar ahora"
              onPress={() => navigation.navigate('Contacts')}
              variant="warning"
              size="small"
              style={styles.warningButton}
            />
          </Card>
        )}

        {/* Menú de opciones */}
        <Card style={styles.menuCard}>
          <Text style={styles.menuTitle}>Opciones</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <Button
                key={index}
                title={`${item.icon}\n${item.title}\n${item.subtitle}`}
                onPress={() => navigation.navigate(item.screen)}
                variant="ghost"
                style={[styles.menuItem, { borderColor: item.color }]}
                textStyle={[styles.menuItemText, { color: item.color }]}
              />
            ))}
          </View>
        </Card>

        {/* Información de estado */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Sistema activo y monitoreando</Text>
          </View>
          <Text style={styles.statusSubtext}>
            Última actualización: {new Date().toLocaleTimeString('es-CO')}
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },

  // Emergency section
  emergencyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.screenPadding,
  },

  // Warning card
  warningCard: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },
  warningContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  warningIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  warningText: {
    flex: 1,
  },
  warningTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: '#856404',
    marginBottom: spacing.xs / 2,
  },
  warningSubtitle: {
    fontSize: typography.sizes.sm,
    color: '#856404',
  },
  warningButton: {
    alignSelf: 'flex-start',
  },

  // Menu
  menuCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },
  menuTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  menuItem: {
    width: '47%',
    height: 100,
    borderWidth: 2,
    borderRadius: spacing.cardRadius,
    backgroundColor: 'transparent',
  },
  menuItemText: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Status
  statusCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.xl,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
    marginRight: spacing.sm,
  },
  statusText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  statusSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen;
