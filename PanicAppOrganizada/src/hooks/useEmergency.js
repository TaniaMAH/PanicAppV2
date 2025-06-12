/**
 * 🚨 HOOK PARA EMERGENCIAS
 * ========================
 */

import { useState, useRef } from 'react';
import LocationService from '../services/LocationService';
import ContactService from '../services/ContactService';
import StorageService from '../services/StorageService';
import BlockchainService from '../services/BlockchainService';

export const useEmergency = () => {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('idle'); // idle, loading, location, sending, blockchain, success, error
  
  const abortController = useRef(null);

  // Activar alerta de emergencia
  const activateEmergency = async (userName, privateKey = null) => {
    if (isActive) return { success: false, error: 'Emergency already active' };
    
    setIsActive(true);
    setLoading(true);
    setError(null);
    setProgress(0);
    setStep('loading');
    
    // Crear controlador para cancelar proceso
    abortController.current = new AbortController();
    
    try {
      // Paso 1: Cargar datos necesarios (10%)
      setProgress(10);
      const contacts = await StorageService.getContacts();
      
      if (contacts.length === 0) {
        throw new Error('No emergency contacts configured');
      }

      // Paso 2: Obtener ubicación (30%)
      setStep('location');
      setProgress(30);
      const location = await LocationService.getCurrentLocation();
      
      if (abortController.current?.signal.aborted) {
        throw new Error('Emergency cancelled by user');
      }

      // Paso 3: Enviar mensajes (60%)
      setStep('sending');
      setProgress(60);
      
      const emergencyMessage = LocationService.generateLocationMessage(
        userName,
        location.latitude,
        location.longitude,
        true // Es emergencia
      );

      const sendResults = await ContactService.sendMessageToAllContacts(
        emergencyMessage,
        userName
      );

      if (abortController.current?.signal.aborted) {
        throw new Error('Emergency cancelled by user');
      }

      // Paso 4: Registrar en blockchain (si está configurado) (80%)
      let blockchainResult = null;
      if (privateKey) {
        setStep('blockchain');
        setProgress(80);
        
        try {
          const initialized = await BlockchainService.initialize(privateKey);
          if (initialized) {
            blockchainResult = await BlockchainService.sendAlert(
              userName,
              location.latitude,
              location.longitude
            );
          }
        } catch (blockchainError) {
          console.warn('Blockchain registration failed:', blockchainError);
          // No fallar por errores de blockchain
        }
      }

      // Paso 5: Guardar historial (90%)
      setProgress(90);
      await StorageService.saveAlertHistory({
        type: 'emergency_alert',
        location,
        contacts: sendResults.summary,
        message: emergencyMessage,
        blockchain: blockchainResult,
        timestamp: new Date().toISOString(),
      });

      // Completado (100%)
      setStep('success');
      setProgress(100);
      
      return {
        success: true,
        location,
        contacts: sendResults.summary,
        blockchain: blockchainResult,
        message: 'Emergency alert sent successfully',
      };

    } catch (err) {
      setStep('error');
      setError(err.message);
      
      return {
        success: false,
        error: err.message,
      };
    } finally {
      setLoading(false);
      setIsActive(false);
      abortController.current = null;
    }
  };

  // Cancelar emergencia en curso
  const cancelEmergency = () => {
    if (abortController.current) {
      abortController.current.abort();
    }
    
    setIsActive(false);
    setLoading(false);
    setStep('idle');
    setProgress(0);
    setError('Emergency cancelled by user');
  };

  // Reiniciar estado
  const reset = () => {
    setIsActive(false);
    setLoading(false);
    setError(null);
    setProgress(0);
    setStep('idle');
    
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
  };

  return {
    isActive,
    loading,
    error,
    progress,
    step,
    activateEmergency,
    cancelEmergency,
    reset,
  };
};

export default useEmergency;
