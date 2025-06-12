/**
 * 🔄 PANTALLA DE UBICACIÓN EN TIEMPO REAL
 * =======================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  AppState,
  Linking,
} from 'react-native';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LocationCard from '../../components/emergency/LocationCard';
import { colors, spacing, typography } from '../../styles/theme';
import LocationService from '../../services/LocationService';
import ContactService from '../../services/ContactService';
import StorageService from '../../services/StorageService';
import { Formatters } from '../../utils/formatters';

const RealTimeLocationScreen = ({ navigation }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [location, setLocation] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [userName, setUserName] = useState('');
  const [sharingDuration, setSharingDuration] = useState(0);
  const [sessionId] = useState(Date.now().toString());
  const [loading, setLoading] = useState(false);

  const intervalId = useRef(null);
  const appState = useRef(AppState.currentState);
  const removeLocationListener = useRef(null);

  useEffect(() => {
    loadInitialData();
    setupAppStateListener();
    
    return () => {
      cleanup();
    };
  }, []);

  const loadInitialData = async () => {
    try {
      const contactsList = await StorageService.getContacts();
      const name = await StorageService.getUserName();
      
      setContacts(contactsList);
      setUserName(name || 'Usuario');

      if (contactsList.length === 0) {
        Alert.alert(
          '🚫 Sin contactos',
          'Debes agregar al menos un contacto de emergencia antes de compartir tu ubicación.',
          [
            { text: 'Cancelar', onPress: () => navigation.goBack() },
            { text: 'Agregar', onPress: () => navigation.navigate('Contacts') },
          ]
        );
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    }
  };

  const setupAppStateListener = () => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  };

  const handleAppStateChange = (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      if (isSharing) {
        Alert.alert(
          '📍 Compartiendo ubicación',
          'Tu ubicación se sigue compartiendo en tiempo real'
        );
      }
    }
    appState.current = nextAppState;
  };

  const startLocationSharing = async () => {
    if (contacts.length === 0) {
      Alert.alert('Sin contactos', 'Agrega contactos antes de compartir ubicación');
      return;
    }

    setLoading(true);

    try {
      // Crear listener para ubicaciones
      removeLocationListener.current = LocationService.addLocationListener(handleLocationUpdate);

      // Iniciar seguimiento
      await LocationService.startTracking(handleLocationUpdate, {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 30000,
        fastestInterval: 15000,
      });

      setIsSharing(true);
      setSharingDuration(0);

      // Iniciar contador de duración
      intervalId.current = setInterval(() => {
        setSharingDuration(prev => prev + 1);
      }, 1000);

      // Enviar mensaje inicial
      sendInitialMessage();

      Alert.alert(
        '✅ Compartiendo ubicación',
        'Tu ubicación se está compartiendo en tiempo real. Los contactos recibirán actualizaciones automáticas.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error iniciando seguimiento:', error);
      Alert.alert(
        'Error',
        'No se pudo iniciar el seguimiento. Verifica que el GPS esté activado y los permisos otorgados.'
      );
    } finally {
      setLoading(false);
    }
  };

  const stopLocationSharing = () => {
    Alert.alert(
      'Detener seguimiento',
      '¿Estás seguro de que quieres detener el seguimiento en tiempo real?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Detener',
          style: 'destructive',
          onPress: () => {
            cleanup();
            sendStopMessage();
            Alert.alert('✅ Detenido', 'Seguimiento en tiempo real detenido');
          },
        },
      ]
    );
  };

  const cleanup = () => {
    // Detener seguimiento de ubicación
    LocationService.stopTracking();
    
    // Remover listener
    if (removeLocationListener.current) {
      removeLocationListener.current();
      removeLocationListener.current = null;
    }
    
    // Limpiar interval
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
    
    setIsSharing(false);
    setSharingDuration(0);
  };

  const handleLocationUpdate = (newLocation) => {
    setLocation(newLocation);
    
    // Enviar ubicación actualizada cada cierto tiempo
    if (isSharing && sharingDuration > 0 && sharingDuration % 60 === 0) { // Cada minuto
      sendLocationUpdate(newLocation);
    }
  };

  const sendInitialMessage = async () => {
    const message = `🔄 ${userName} ha iniciado el seguimiento en tiempo real de su ubicación.

📍 Podrás ver las actualizaciones de ubicación periódicamente.

⚠️ Esta es una función de seguridad. Mantente atento a las actualizaciones.

🕒 Iniciado: ${new Date().toLocaleString('es-CO')}`;

    await ContactService.sendMessageToAllContacts(message, userName);
  };

  const sendLocationUpdate = async (currentLocation) => {
    if (!currentLocation) return;

    const message = LocationService.generateLocationMessage(
      userName,
      currentLocation.latitude,
      currentLocation.longitude,
      false
    );

    const updateMessage = `🔄 Actualización de ubicación en tiempo real:

${message}

⏱️ Tiempo compartiendo: ${Formatters.formatDuration(sharingDuration)}
🎯 Precisión: ${currentLocation.accuracy ? Math.round(currentLocation.accuracy) + 'm' : 'N/A'}`;

    await ContactService.sendMessageToAllContacts(updateMessage, userName);
  };

  const sendStopMessage = async () => {
    const message = `ℹ️ ${userName} ha detenido el seguimiento en tiempo real de ubicación.

⏱️ Duración total: ${Formatters.formatDuration(sharingDuration)}
🕒 Finalizado: ${new Date().toLocaleString('es-CO')}

✅ El seguimiento ha terminado.`;

    await ContactService.sendMessageToAllContacts(message, userName);
  };

  const shareCurrentLocation = () => {
    if (!location) return;
    
    const mapLinks = LocationService.generateMapLinks(location.latitude, location.longitude);
    
    Alert.alert(
      'Compartir ubicación actual',
      '¿Con qué aplicación quieres compartir?',
      [
        { text: 'Google Maps', onPress: () => Linking.openURL(mapLinks.google) },
        { text: 'Waze', onPress: () => Linking.openURL(mapLinks.waze) },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const formatDuration = (seconds) => {
    return Formatters.formatDuration(seconds);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Seguimiento en Tiempo Real"
        subtitle={isSharing ? `🟢 Activo - ${formatDuration(sharingDuration)}` : '🔴 Inactivo'}
        leftIcon={<Text style={styles.headerIcon}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Estado del seguimiento */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[
              styles.statusDot,
              { backgroundColor: isSharing ? colors.success : colors.medium }
            ]} />
            <Text style={styles.statusTitle}>
              {isSharing ? 'Compartiendo ubicación' : 'Seguimiento detenido'}
            </Text>
          </View>
          
          {isSharing && (
            <View style={styles.durationContainer}>
              <Text style={styles.durationLabel}>⏱️ Tiempo activo:</Text>
              <Text style={styles.durationText}>{formatDuration(sharingDuration)}</Text>
            </View>
          )}
        </Card>

        {/* Tarjeta de ubicación */}
        <LocationCard
          location={location}
          isTracking={isSharing}
          accuracy={location?.accuracy}
          timestamp={location?.timestamp}
          onSharePress={shareCurrentLocation}
          onViewMapPress={() => {
            if (location) {
              const mapLinks = LocationService.generateMapLinks(location.latitude, location.longitude);
              Linking.openURL(mapLinks.google);
            }
          }}
          style={styles.locationCard}
        />

        {/* Controles principales */}
        <Card style={styles.controlsCard}>
          <Text style={styles.controlsTitle}>Controles</Text>
          
          {!isSharing ? (
            <Button
              title="🚨 Iniciar seguimiento en tiempo real"
              onPress={startLocationSharing}
              disabled={contacts.length === 0 || loading}
              loading={loading}
              variant="primary"
              size="large"
              style={styles.controlButton}
            />
          ) : (
            <Button
              title="⏹️ Detener seguimiento"
              onPress={stopLocationSharing}
              variant="danger"
              size="large"
              style={styles.controlButton}
            />
          )}
        </Card>

        {/* Información del seguimiento */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>ℹ️ Información del seguimiento</Text>
          <Text style={styles.infoText}>
            • La ubicación se actualiza cada 30 segundos{'\n'}
            • Los contactos reciben actualizaciones cada minuto{'\n'}
            • Funciona en segundo plano mientras la app esté abierta{'\n'}
            • Se detiene automáticamente después de 4 horas{'\n'}
            • Usa esta función solo en emergencias reales
          </Text>
        </Card>

        {/* Contactos que recibirán updates */}
        <Card style={styles.contactsCard}>
          <Text style={styles.contactsTitle}>
            👥 Contactos que reciben actualizaciones ({contacts.length})
          </Text>
          
          {contacts.length === 0 ? (
            <View style={styles.noContactsContainer}>
              <Text style={styles.noContactsText}>No hay contactos configurados</Text>
              <Button
                title="➕ Agregar contactos"
                onPress={() => navigation.navigate('Contacts')}
                variant="outline"
                size="small"
              />
            </View>
          ) : (
            contacts.map((contact, index) => (
              <View key={contact.id || index} style={styles.contactItem}>
                <Text style={styles.contactName}>• {contact.nombre}</Text>
                <Text style={styles.contactPhone}>{contact.telefono}</Text>
              </View>
            ))
          )}
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

  // Header
  headerIcon: {
    fontSize: 20,
    color: colors.textWhite,
  },

  // Status card
  statusCard: {
    margin: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  statusTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  durationContainer: {
    alignItems: 'center',
  },
  durationLabel: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  durationText: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.success,
    fontFamily: 'monospace',
  },

  // Cards
  locationCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  controlsCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  infoCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
    backgroundColor: colors.warning + '20',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  contactsCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.xl,
  },

  // Controls
  controlsTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  controlButton: {
    marginBottom: spacing.sm,
  },

  // Info
  infoTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.warning,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.warning,
    lineHeight: 20,
  },

  // Contacts
  contactsTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  noContactsContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  noContactsText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  contactItem: {
    paddingVertical: spacing.xs,
  },
  contactName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  contactPhone: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginLeft: spacing.md,
  },
});

export default RealTimeLocationScreen;
