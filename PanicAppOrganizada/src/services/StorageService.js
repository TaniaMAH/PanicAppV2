/**
 * 📊 STORAGE SERVICE
 * ==================
 * Gestión centralizada de AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  // 🔑 Claves de almacenamiento
  static KEYS = {
    USER_NAME: 'user_name',
    CONTACTS: 'contacts',
    WALLET: 'user_wallet',
    SETTINGS: 'app_settings',
    ALERT_HISTORY: 'alert_history',
    ONBOARDING: 'has_seen_welcome',
    LOCATION_PERMISSIONS: 'location_permissions',
  };

  /**
   * 💾 Guardar dato
   */
  static async save(key, data) {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonData);
      console.log(`✅ Guardado: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error guardando ${key}:`, error);
      return false;
    }
  }

  /**
   * 📖 Obtener dato
   */
  static async get(key, defaultValue = null) {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data === null) return defaultValue;
      return JSON.parse(data);
    } catch (error) {
      console.error(`❌ Error obteniendo ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * 🗑️ Eliminar dato
   */
  static async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`🗑️ Eliminado: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error eliminando ${key}:`, error);
      return false;
    }
  }

  /**
   * 🔄 Limpiar todo
   */
  static async clear() {
    try {
      await AsyncStorage.clear();
      console.log('🔄 Storage limpiado completamente');
      return true;
    } catch (error) {
      console.error('❌ Error limpiando storage:', error);
      return false;
    }
  }

  /**
   * 👤 Métodos específicos para usuario
   */
  static async saveUserName(name) {
    return await this.save(this.KEYS.USER_NAME, name);
  }

  static async getUserName() {
    return await this.get(this.KEYS.USER_NAME, '');
  }

  /**
   * 👥 Métodos específicos para contactos
   */
  static async saveContacts(contacts) {
    return await this.save(this.KEYS.CONTACTS, contacts);
  }

  static async getContacts() {
    return await this.get(this.KEYS.CONTACTS, []);
  }

  static async addContact(contact) {
    const contacts = await this.getContacts();
    contacts.push({
      ...contact,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    });
    return await this.saveContacts(contacts);
  }

  static async removeContact(contactId) {
    const contacts = await this.getContacts();
    const filteredContacts = contacts.filter(c => c.id !== contactId);
    return await this.saveContacts(filteredContacts);
  }

  /**
   * 🚨 Métodos para historial de alertas
   */
  static async saveAlertHistory(alert) {
    const history = await this.get(this.KEYS.ALERT_HISTORY, []);
    history.push({
      ...alert,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    });
    return await this.save(this.KEYS.ALERT_HISTORY, history);
  }

  static async getAlertHistory() {
    return await this.get(this.KEYS.ALERT_HISTORY, []);
  }

  /**
   * ⚙️ Métodos para configuraciones
   */
  static async saveSettings(settings) {
    return await this.save(this.KEYS.SETTINGS, settings);
  }

  static async getSettings() {
    return await this.get(this.KEYS.SETTINGS, {
      enableNotifications: true,
      enableVibration: true,
      enableSound: true,
      theme: 'light',
    });
  }

  /**
   * 🎯 Método de inicialización
   */
  static async initialize() {
    try {
      // Verificar si es primera vez
      const hasSeenWelcome = await this.get(this.KEYS.ONBOARDING, false);
      const userName = await this.getUserName();
      
      return {
        isFirstTime: !hasSeenWelcome || !userName,
        userName,
        hasSeenWelcome,
      };
    } catch (error) {
      console.error('❌ Error inicializando storage:', error);
      return {
        isFirstTime: true,
        userName: '',
        hasSeenWelcome: false,
      };
    }
  }
}

export default StorageService;
