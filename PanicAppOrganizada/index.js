/**
 * @format
 * 🚀 ENTRADA PRINCIPAL - PANICAPP ORGANIZADA
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Polyfills para Web3 y crypto
import 'react-native-crypto';
import { Buffer } from 'buffer';

// Configurar globales necesarios para Web3
global.Buffer = Buffer;

// Configurar fetch timeout global
const originalFetch = global.fetch;
global.fetch = (url, options = {}) => {
  return originalFetch(url, {
    timeout: 30000, // 30 segundos
    ...options,
  });
};

// Manejo de errores globales
const defaultHandler = global.ErrorUtils.getGlobalHandler();
global.ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.error('💥 Error global capturado:', error);
  
  // Log adicional para debugging
  if (__DEV__) {
    console.error('Stack trace:', error.stack);
  }
  
  // Llamar al handler original
  defaultHandler(error, isFatal);
});

// Registrar la aplicación
AppRegistry.registerComponent(appName, () => App);

// Log de inicio
console.log('🆘 PanicApp Organizada registrada exitosamente');