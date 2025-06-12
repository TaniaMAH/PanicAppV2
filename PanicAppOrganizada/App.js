/**
 * 📱 APLICACIÓN PRINCIPAL - PANICAPP ORGANIZADA
 * =============================================
 */

import React, { useEffect } from 'react';
import { StatusBar, Platform, Alert } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/styles/theme';

// Polyfill para Web3 en React Native
import 'react-native-crypto';
import { Buffer } from 'buffer';

// Configurar Buffer globalmente para Web3
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

const App = () => {
  useEffect(() => {
    // Configuración inicial de la app
    initializeApp();
  }, []);

  const initializeApp = () => {
    console.log('🚀 PanicApp Organizada iniciando...');
    
    // Configurar orientación solo portrait en producción
    if (!__DEV__) {
      // Solo permitir orientación vertical
    }

    // Verificar permisos críticos en iOS
    if (Platform.OS === 'ios') {
      setTimeout(checkiOSRequirements, 3000);
    }
  };

  const checkiOSRequirements = () => {
    Alert.alert(
      '📱 Configuración iOS',
      'Para el funcionamiento óptimo:\n\n• Permite ubicación "Siempre"\n• Activa notificaciones\n• Mantén la app en primer plano durante emergencias',
      [
        { text: 'Configurar después', style: 'cancel' },
        { text: 'Ir a Configuración', onPress: openAppSettings },
      ]
    );
  };

  const openAppSettings = () => {
    if (Platform.OS === 'ios') {
      // En iOS se abre automáticamente la configuración de la app
      Alert.alert('Ve a Configuración > PanicApp para ajustar permisos');
    }
  };

  return (
    <>
      <StatusBar 
        backgroundColor={colors.dark} 
        barStyle="light-content" 
        translucent={false}
        hidden={false}
      />
      <AppNavigator />
    </>
  );
};

export default App;