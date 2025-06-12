/**
 * 📍 HOOK PARA GEOLOCALIZACIÓN
 * ============================
 */

import { useState, useEffect, useRef } from 'react';
import LocationService from '../services/LocationService';

export const useLocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  
  const removeListener = useRef(null);

  // Obtener ubicación actual
  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const currentLocation = await LocationService.getCurrentLocation();
      setLocation(currentLocation);
      return currentLocation;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Iniciar seguimiento
  const startTracking = async (trackingOptions = {}) => {
    if (isTracking) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const success = await LocationService.startTracking(
        (newLocation) => {
          setLocation(newLocation);
        },
        { ...options, ...trackingOptions }
      );
      
      if (success) {
        setIsTracking(true);
        
        // Agregar listener adicional
        removeListener.current = LocationService.addLocationListener((newLocation) => {
          setLocation(newLocation);
        });
      }
      
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Detener seguimiento
  const stopTracking = () => {
    LocationService.stopTracking();
    
    if (removeListener.current) {
      removeListener.current();
      removeListener.current = null;
    }
    
    setIsTracking(false);
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  return {
    location,
    loading,
    error,
    isTracking,
    getCurrentLocation,
    startTracking,
    stopTracking,
  };
};

export default useLocation;
