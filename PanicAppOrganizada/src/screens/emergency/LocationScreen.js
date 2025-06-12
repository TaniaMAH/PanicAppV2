/**
 * 📍 PANTALLA DE UBICACIÓN
 * ========================
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
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

const LocationScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
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
          'Debes agregar al menos un contacto de emergencia.',
          [
            { text: 'Cancelar', onPress: () => navigation.goBack() },
            { text: 'Agregar', onPress: () => navigation.navigate('Contacts') },
          ]
        );
        return;
      }

      getCurrentLocation();
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    
    try {
      const currentLocation = await LocationService.getCurrentLocation();
      setLocation(currentLocation);
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      Alert.alert(
        'Error de ubicación',
        'No se pudo obtener tu ubicación. Verifica que el GPS esté activado.',
        [
          { text: 'Reintentar', onPress: getCurrentLocation },
          { text: 'Cancelar' },
        ]
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const shareLocationWithAll = async () => {
    if (!location) {
      Alert.alert('Error', 'Primero debes obtener tu ubicación');
      return;
    }

    Alert.alert(
      'Compartir con todos',
      `¿Enviar tu ubicación a todos los contactos (${contacts.length})?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: async () => {
            setLoading(true);

            try {
              const message = LocationService.generateLocationMessage(
                userName,
                location.latitude,
                location.longitude,
                false
              );

              const result = await ContactService.sendMessageToAllContacts(message, userName);
              
              if (result.success) {
                Alert.alert(
                  '✅ Enviado',
                  `Ubicación enviada a ${result.summary.sent} de ${result.summary.total} contactos`
                );
              } else {
                Alert.alert('❌ Error', result.error || 'No se pudo enviar');
              }
            } catch (error) {
              console.error('Error enviando:', error);
              Alert.alert('Error', 'Ocurrió un error al enviar la ubicación');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const openInMap = () => {
    if (!location) return;

    const mapLinks = LocationService.generateMapLinks(location.latitude, location.longitude);
    
    Alert.alert(
      'Abrir en mapa',
      '¿Con qué aplicación quieres ver la ubicación?',
      [
        { text: 'Google Maps', onPress: () => Linking.openURL(mapLinks.google) },
        { text: 'Waze', onPress: () => Linking.openURL(mapLinks.waze) },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Compartir Ubicación"
        subtitle={location ? 'Ubicación obtenida' : 'Obteniendo ubicación...'}
        leftIcon={<Text style={styles.headerIcon}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <LocationCard
          location={location}
          accuracy={location?.accuracy}
          timestamp={location?.timestamp}
          onSharePress={shareLocationWithAll}
          onViewMapPress={openInMap}
          style={styles.locationCard}
        />

        <Card style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Acciones rápidas</Text>
          
          <Button
            title="🔄 Actualizar ubicación"
            onPress={getCurrentLocation}
            loading={locationLoading}
            variant="secondary"
            style={styles.actionButton}
          />
          
          <Button
            title="📤 Enviar a todos los contactos"
            onPress={shareLocationWithAll}
            disabled={!location || contacts.length === 0}
            loading={loading}
            variant="primary"
            style={styles.actionButton}
          />
          
          <Button
            title="🔄 Ir a seguimiento en tiempo real"
            onPress={() => navigation.navigate('RealTimeLocation')}
            disabled={!location}
            variant="outline"
            style={styles.actionButton}
          />
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>ℹ️ Información</Text>
          <Text style={styles.infoText}>
            • Esta función envía tu ubicación actual una sola vez{'\n'}
            • Para seguimiento continuo usa "Tiempo Real"{'\n'}
            • La precisión depende de la señal GPS{'\n'}
            • Los contactos recibirán un enlace a Google Maps
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
  headerIcon: {
    fontSize: 20,
    color: colors.textWhite,
  },
  locationCard: {
    margin: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  actionsCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  actionsTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  infoCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.xl,
    backgroundColor: colors.info + '20',
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  infoTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.info,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.info,
    lineHeight: 20,
  },
});

export default LocationScreen;
