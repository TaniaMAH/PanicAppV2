/**
 * 🔧 CONFIGURACIÓN PRINCIPAL DE LA APP
 * ====================================
 */

// Detectar entorno
const isDevelopment = __DEV__;
const isProduction = !__DEV__;

// Configuración por entorno
const config = {
  // 🌍 Configuración general
  app: {
    name: 'PanicApp',
    version: '2.0.0',
    environment: isDevelopment ? 'development' : 'production',
  },

  // 🔐 APIs y servicios
  api: {
    timeout: 10000,
    retries: 3,
    baseURL: isDevelopment 
      ? 'https://api-dev.panicapp.com' 
      : 'https://api.panicapp.com',
  },

  // 📍 Ubicación
  location: {
    updateInterval: 30000, // 30 segundos
    accuracyThreshold: 50, // 50 metros
    enableBackground: true,
    timeout: 20000,
  },

  // 🔔 Notificaciones
  notifications: {
    enabled: true,
    enableSound: true,
    enableVibration: true,
  },

  // 🎨 UI/UX
  ui: {
    enableAnimations: true,
    theme: 'light',
    enableHapticFeedback: true,
  },

  // 🐛 Debug
  debug: {
    enableLogging: isDevelopment,
    enableReduxLogger: isDevelopment,
    showPerformanceMonitor: isDevelopment,
  },
};

export default config;
