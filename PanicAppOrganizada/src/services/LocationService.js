/**
 * 📍 LOCATION SERVICE
 * ===================
 * Gestión avanzada de geolocalización
 */

import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

class LocationService {
  constructor() {
    this.watchId = null;
    this.isTracking = false;
    this.listeners = [];
    this.lastKnownLocation = null;
  }

  /**
   * 🔐 Solicitar permisos de ubicación
   */
  async requestLocationPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        ]);

        const hasFineLocation = granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted';
        const hasCoarseLocation = granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === 'granted';

        return hasFineLocation || hasCoarseLocation;
      } catch (error) {
        console.error('❌ Error solicitando permisos:', error);
        return false;
      }
    }

    // Para iOS, los permisos se manejan automáticamente
    return true;
  }

  /**
   * 📍 Obtener ubicación actual
   */
  async getCurrentLocation() {
    const hasPermission = await this.requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Permisos de ubicación denegados');
    }

    return new Promise((resolve, reject) => {
      const options = {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
      };

      Geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed,
            heading: position.coords.heading,
            timestamp: position.timestamp,
            formattedTime: new Date().toISOString(),
          };

          this.lastKnownLocation = locationData;
          console.log('📍 Ubicación obtenida:', locationData);
          resolve(locationData);
        },
        (error) => {
          console.error('❌ Error de ubicación:', error);
          this.handleLocationError(error);
          reject(error);
        },
        options
      );
    });
  }

  /**
   * 🔄 Iniciar seguimiento continuo
   */
  async startTracking(callback, options = {}) {
    const hasPermission = await this.requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Permisos de ubicación denegados');
    }

    if (this.watchId) {
      this.stopTracking();
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      distanceFilter: 10, // metros
      interval: 30000, // 30 segundos
      fastestInterval: 15000, // 15 segundos mínimo
      timeout: 20000,
      maximumAge: 10000,
      ...options,
    };

    this.isTracking = true;

    this.watchId = Geolocation.watchPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed,
          heading: position.coords.heading,
          timestamp: position.timestamp,
          formattedTime: new Date().toISOString(),
        };

        this.lastKnownLocation = locationData;
        
        // Notificar a todos los listeners
        this.listeners.forEach(listener => listener(locationData));
        
        if (callback) callback(locationData);
      },
      (error) => {
        console.error('❌ Error en seguimiento:', error);
        this.handleLocationError(error);
      },
      defaultOptions
    );

    console.log('🔄 Seguimiento de ubicación iniciado');
    return this.watchId;
  }

  /**
   * ⏹️ Detener seguimiento
   */
  stopTracking() {
    if (this.watchId) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isTracking = false;
      console.log('⏹️ Seguimiento de ubicación detenido');
    }
  }

  /**
   * 👂 Agregar listener para cambios de ubicación
   */
  addLocationListener(callback) {
    this.listeners.push(callback);
    
    // Devolver función para remover listener
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * 🗺️ Generar enlaces de mapas
   */
  generateMapLinks(latitude, longitude, label = 'Ubicación de emergencia') {
    const googleMapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
    const wazeUrl = `https://waze.com/ul?ll=${latitude},${longitude}`;
    const appleMapsUrl = `http://maps.apple.com/?q=${latitude},${longitude}`;

    return {
      google: googleMapsUrl,
      waze: wazeUrl,
      apple: appleMapsUrl,
      universal: googleMapsUrl, // Por defecto Google Maps
    };
  }

  /**
   * 📱 Generar mensaje de ubicación para compartir
   */
  generateLocationMessage(userName, latitude, longitude, isEmergency = false) {
    const mapLinks = this.generateMapLinks(latitude, longitude);
    const emoji = isEmergency ? '🚨' : '📍';
    const urgency = isEmergency ? 'EMERGENCIA' : 'ubicación';
    
    return `${emoji} ${isEmergency ? '¡' : ''}${urgency.toUpperCase()} de ${userName}${isEmergency ? '!' : ''}

📍 Ver ubicación:
${mapLinks.google}

🕒 ${new Date().toLocaleString('es-ES', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })}

${isEmergency ? '⚠️ Esta es una alerta de emergencia. Por favor, responde inmediatamente.' : ''}`;
  }

  /**
   * ❌ Manejar errores de ubicación
   */
  handleLocationError(error) {
    let message = 'Error desconocido de ubicación';
    
    switch (error.code) {
      case 1: // PERMISSION_DENIED
        message = 'Permisos de ubicación denegados';
        break;
      case 2: // POSITION_UNAVAILABLE
        message = 'Ubicación no disponible. Verifica GPS';
        break;
      case 3: // TIMEOUT
        message = 'Tiempo agotado obteniendo ubicación';
        break;
    }

    console.error(`❌ ${message}:`, error);
    
    Alert.alert(
      'Error de Ubicación',
      message + '\n\nVerifica que el GPS esté activado y que hayas otorgado permisos de ubicación.',
      [{ text: 'Entendido' }]
    );
  }

  /**
   * 📊 Obtener estado del servicio
   */
  getStatus() {
    return {
      isTracking: this.isTracking,
      watchId: this.watchId,
      lastKnownLocation: this.lastKnownLocation,
      listenersCount: this.listeners.length,
    };
  }

  /**
   * 🧹 Limpiar recursos
   */
  cleanup() {
    this.stopTracking();
    this.listeners = [];
    this.lastKnownLocation = null;
  }
}

// Exportar instancia singleton
export default new LocationService();
