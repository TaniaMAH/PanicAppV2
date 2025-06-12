/**
 * 🎯 CONSTANTES DE LA APLICACIÓN
 * ==============================
 */

export const APP_CONFIG = {
  name: 'PanicApp',
  version: '2.0.0',
  author: 'PanicApp Team',
};

// 🎨 Constantes de UI
export const UI_CONSTANTS = {
  // Timeouts
  SPLASH_TIMEOUT: 2000,
  ALERT_TIMEOUT: 5000,
  LOADING_TIMEOUT: 10000,
  
  // Animaciones
  ANIMATION_DURATION: 300,
  PULSE_DURATION: 1000,
  FADE_DURATION: 500,
  
  // Elementos
  BUTTON_HEIGHT: 50,
  INPUT_HEIGHT: 50,
  HEADER_HEIGHT: 60,
  TAB_HEIGHT: 80,
};

// 📍 Constantes de ubicación
export const LOCATION_CONSTANTS = {
  UPDATE_INTERVAL: 30000, // 30 segundos
  ACCURACY_THRESHOLD: 50, // 50 metros
  TIMEOUT: 20000, // 20 segundos
  MAX_AGE: 10000, // 10 segundos
  DISTANCE_FILTER: 10, // 10 metros
};

// 🚨 Constantes de emergencia
export const EMERGENCY_CONSTANTS = {
  MAX_CONTACTS: 10,
  MIN_CONTACTS: 1,
  ALERT_COOLDOWN: 30000, // 30 segundos entre alertas
  TRACKING_DURATION: 14400000, // 4 horas máximo
};

// 📱 Constantes de validación
export const VALIDATION_CONSTANTS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_MIN_LENGTH: 7,
  PHONE_MAX_LENGTH: 15,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[0-9]{7,15}$/,
};

// 🔔 Mensajes de la aplicación
export const MESSAGES = {
  // Errores
  ERRORS: {
    NETWORK: 'Error de conexión. Verifica tu internet.',
    PERMISSION: 'Permisos necesarios no otorgados.',
    LOCATION: 'No se pudo obtener la ubicación.',
    STORAGE: 'Error guardando información.',
    VALIDATION: 'Datos ingresados no válidos.',
    UNKNOWN: 'Error desconocido. Intenta de nuevo.',
  },
  
  // Éxito
  SUCCESS: {
    SAVED: 'Información guardada correctamente.',
    SENT: 'Mensaje enviado exitosamente.',
    UPDATED: 'Actualización completada.',
    DELETED: 'Eliminado correctamente.',
  },
  
  // Información
  INFO: {
    LOADING: 'Cargando...',
    PROCESSING: 'Procesando...',
    SENDING: 'Enviando...',
    WAITING: 'Esperando respuesta...',
  },
};

// 🎨 Constantes de tema
export const THEME_CONSTANTS = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
};

// 📊 Constantes de almacenamiento
export const STORAGE_KEYS = {
  USER_DATA: 'user_data',
  CONTACTS: 'contacts',
  SETTINGS: 'app_settings',
  THEME: 'app_theme',
  ONBOARDING: 'has_seen_welcome',
  ALERT_HISTORY: 'alert_history',
  LOCATION_CACHE: 'location_cache',
};
