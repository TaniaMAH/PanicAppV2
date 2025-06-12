/**
 * 🔐 HOOK PARA PERMISOS
 * =====================
 */

import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState({
    location: 'unknown',
    backgroundLocation: 'unknown',
    camera: 'unknown',
    microphone: 'unknown',
  });
  const [loading, setLoading] = useState(false);

  // Verificar estado de permisos
  const checkPermissions = async () => {
    setLoading(true);
    
    try {
      if (Platform.OS === 'android') {
        const results = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        setPermissions({
          location: results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] || 
                   results[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION],
          backgroundLocation: results[PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION],
          camera: results[PermissionsAndroid.PERMISSIONS.CAMERA],
          microphone: results[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
        });
      } else {
        // iOS - Los permisos se manejan automáticamente
        setPermissions({
          location: 'granted',
          backgroundLocation: 'granted',
          camera: 'granted',
          microphone: 'granted',
        });
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Solicitar permisos de ubicación
  const requestLocationPermission = async () => {
    setLoading(true);
    
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        const hasLocation = granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted' ||
                           granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === 'granted';

        if (hasLocation) {
          await checkPermissions();
          return true;
        } else {
          Alert.alert(
            'Permisos requeridos',
            'Esta app necesita acceso a tu ubicación para funcionar correctamente.',
            [{ text: 'OK' }]
          );
          return false;
        }
      }
      
      return true; // iOS
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Solicitar permisos de ubicación en segundo plano
  const requestBackgroundLocationPermission = async () => {
    if (Platform.OS !== 'android') return true;
    
    setLoading(true);
    
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Ubicación en segundo plano',
          message: 'Para enviar alertas de emergencia automáticas, necesitamos acceder a tu ubicación en segundo plano.',
          buttonNeutral: 'Pregúntame después',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Permitir',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await checkPermissions();
        return true;
      } else {
        Alert.alert(
          'Permiso recomendado',
          'Para mejores funciones de emergencia, considera permitir el acceso a ubicación en segundo plano.',
          [{ text: 'OK' }]
        );
        return false;
      }
    } catch (error) {
      console.error('Error requesting background location permission:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Verificar si todos los permisos críticos están otorgados
  const hasEssentialPermissions = () => {
    return permissions.location === 'granted';
  };

  // Obtener resumen de permisos
  const getPermissionsSummary = () => {
    const granted = Object.values(permissions).filter(p => p === 'granted').length;
    const total = Object.keys(permissions).length;
    
    return {
      granted,
      total,
      percentage: (granted / total) * 100,
      hasEssential: hasEssentialPermissions(),
    };
  };

  // Verificar permisos al montar
  useEffect(() => {
    checkPermissions();
  }, []);

  return {
    permissions,
    loading,
    checkPermissions,
    requestLocationPermission,
    requestBackgroundLocationPermission,
    hasEssentialPermissions,
    getPermissionsSummary,
  };
};

export default usePermissions;
