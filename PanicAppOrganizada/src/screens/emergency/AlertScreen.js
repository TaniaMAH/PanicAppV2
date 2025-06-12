/**
 * 🚨 PANTALLA DE ALERTA CON BLOCKCHAIN REAL
 * =========================================
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  BackHandler,
  Linking,
} from 'react-native';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { colors, spacing, typography } from '../../styles/theme';
import LocationService from '../../services/LocationService';
import ContactService from '../../services/ContactService';
import StorageService from '../../services/StorageService';
import BlockchainService from '../../services/BlockchainService';

const AlertScreen = ({ navigation }) => {
  const [step, setStep] = useState('loading');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Iniciando alerta de emergencia...');
  const [location, setLocation] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [blockchainResult, setBlockchainResult] = useState(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step === 'loading' || step === 'getting_location' || step === 'sending') {
        return true;
      }
      return false;
    });

    startEmergencyProcess();

    return () => backHandler.remove();
  }, []);

  const startEmergencyProcess = async () => {
    try {
      // Paso 1: Cargar datos
      setStep('loading');
      setProgress(10);
      setMessage('Cargando datos...');
      
      const contactsList = await StorageService.getContacts();
      const name = await StorageService.getUserName();
      
      setContacts(contactsList);
      setUserName(name || 'Usuario');

      if (contactsList.length === 0) {
        throw new Error('No hay contactos de emergencia configurados');
      }

      // Paso 2: Obtener ubicación
      setStep('getting_location');
      setProgress(20);
      setMessage('Obteniendo ubicación GPS...');
      
      const currentLocation = await LocationService.getCurrentLocation();
      setLocation(currentLocation);

      // Paso 3: Enviar a blockchain
      setStep('sending');
      setProgress(40);
      setMessage('Registrando en blockchain...');

      const blockchainTx = await BlockchainService.sendEmergencyAlert(
        name,
        currentLocation.latitude,
        currentLocation.longitude
      );
      setBlockchainResult(blockchainTx);

      // Paso 4: Enviar alertas por WhatsApp
      setProgress(70);
      setMessage('Enviando alertas de emergencia...');

      const emergencyMessage = LocationService.generateLocationMessage(
        name,
        currentLocation.latitude,
        currentLocation.longitude,
        true
      );

      // Agregar información de blockchain si fue exitoso
      let finalMessage = emergencyMessage;
      if (blockchainTx.success) {
        finalMessage += `\n\n🔗 Registro blockchain: ${blockchainTx.etherscanUrl}`;
      }

      const sendResults = await ContactService.sendMessageToAllContacts(finalMessage, name);
      
      // Paso 5: Guardar en historial
      setProgress(90);
      setMessage('Guardando registro...');
      
      await StorageService.saveAlertHistory({
        type: 'emergency_alert',
        location: currentLocation,
        contacts: sendResults.summary,
        message: finalMessage,
        blockchain: blockchainTx,
        success: sendResults.success,
      });

      // Completado
      setStep('success');
      setProgress(100);
      setResults(sendResults);
      setMessage('¡Alerta enviada exitosamente!');

    } catch (error) {
      console.error('Error en proceso de emergencia:', error);
      setStep('error');
      setError(error.message);
      setMessage('Error enviando alerta');
    }
  };

  const handleRetry = () => {
    setStep('loading');
    setProgress(0);
    setError(null);
    setResults(null);
    setBlockchainResult(null);
    startEmergencyProcess();
  };

  const handleViewBlockchain = () => {
    if (blockchainResult?.etherscanUrl) {
      Linking.openURL(blockchainResult.etherscanUrl);
    }
  };

  const handleFinish = () => {
    Alert.alert(
      '✅ Proceso completado',
      '¿Qué quieres hacer ahora?',
      [
        {
          text: 'Ir al inicio',
          onPress: () => navigation.navigate('Home'),
        },
        {
          text: 'Ver en blockchain',
          onPress: handleViewBlockchain,
        },
        {
          text: 'Seguimiento en tiempo real',
          onPress: () => navigation.navigate('RealTimeLocation'),
        },
      ]
    );
  };

  const renderLoadingStep = () => (
    <Card style={styles.stepCard}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.stepTitle}>{message}</Text>
        
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
    </Card>
  );

  const renderSuccessStep = () => (
    <Card style={styles.stepCard}>
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successTitle}>¡Alerta enviada con éxito!</Text>
        
        {results && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>📱 WhatsApp:</Text>
            <Text style={styles.resultsText}>
              Enviado a: {results.summary.sent} de {results.summary.total} contactos
            </Text>
            
            {blockchainResult && (
              <View style={styles.blockchainContainer}>
                <Text style={styles.resultsTitle}>🔗 Blockchain:</Text>
                {blockchainResult.success ? (
                  <>
                    <Text style={styles.resultsText}>
                      ✅ Registrado exitosamente
                    </Text>
                    <Text style={styles.resultsText}>
                      🧾 TX: {blockchainResult.transactionHash?.substring(0, 20)}...
                    </Text>
                    <Button
                      title="Ver en Etherscan"
                      onPress={handleViewBlockchain}
                      variant="outline"
                      size="small"
                      style={styles.blockchainButton}
                    />
                  </>
                ) : (
                  <Text style={styles.resultsError}>
                    ❌ Error: {blockchainResult.error}
                  </Text>
                )}
              </View>
            )}
            
            {location && (
              <Text style={styles.resultsText}>
                📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </Text>
            )}
          </View>
        )}

        <View style={styles.successActions}>
          <Button
            title="✅ Finalizar"
            onPress={handleFinish}
            variant="primary"
            style={styles.actionButton}
          />
        </View>
      </View>
    </Card>
  );

  const renderErrorStep = () => (
    <Card style={styles.stepCard}>
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.errorTitle}>Error enviando alerta</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        
        <View style={styles.errorActions}>
          <Button
            title="🔄 Reintentar"
            onPress={handleRetry}
            variant="primary"
            style={styles.actionButton}
          />
          
          <Button
            title="🏠 Ir al inicio"
            onPress={() => navigation.navigate('Home')}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      </View>
    </Card>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 'loading':
      case 'getting_location':
      case 'sending':
        return renderLoadingStep();
      case 'success':
        return renderSuccessStep();
      case 'error':
        return renderErrorStep();
      default:
        return renderLoadingStep();
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="🚨 Alerta de Emergencia"
        subtitle={step === 'success' ? 'Completado' : 'Procesando...'}
        backgroundColor={colors.emergency}
      />

      <View style={styles.content}>
        {renderCurrentStep()}
        
        <Card style={styles.warningCard}>
          <Text style={styles.warningTitle}>⚠️ Alerta Real</Text>
          <Text style={styles.warningText}>
            Esta alerta se registra en blockchain y es permanente. 
            Solo úsala en emergencias reales.
          </Text>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.screenPadding,
  },
  stepCard: {
    marginBottom: spacing.lg,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  stepTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: colors.lighter,
    borderRadius: 3,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  successTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.success,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  resultsContainer: {
    width: '100%',
    backgroundColor: colors.success + '20',
    borderRadius: spacing.cardRadius,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  resultsTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.success,
    marginBottom: spacing.sm,
  },
  resultsText: {
    fontSize: typography.sizes.sm,
    color: colors.success,
    marginBottom: spacing.xs,
  },
  resultsError: {
    fontSize: typography.sizes.sm,
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  blockchainContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.success + '40',
  },
  blockchainButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  successActions: {
    width: '100%',
    gap: spacing.sm,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  errorTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  errorMessage: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  errorActions: {
    width: '100%',
    gap: spacing.sm,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  warningCard: {
    backgroundColor: colors.warning + '20',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  warningTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.warning,
    marginBottom: spacing.sm,
  },
  warningText: {
    fontSize: typography.sizes.sm,
    color: colors.warning,
    lineHeight: 20,
  },
});

export default AlertScreen;
