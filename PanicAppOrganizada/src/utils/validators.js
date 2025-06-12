/**
 * ✅ VALIDADORES
 * ==============
 */

import { VALIDATION_CONSTANTS } from './constants';

export class Validators {
  /**
   * 📝 Validar nombre
   */
  static validateName(name) {
    if (!name || typeof name !== 'string') {
      return { isValid: false, error: 'El nombre es requerido' };
    }

    const trimmedName = name.trim();
    
    if (trimmedName.length < VALIDATION_CONSTANTS.NAME_MIN_LENGTH) {
      return { 
        isValid: false, 
        error: `El nombre debe tener al menos ${VALIDATION_CONSTANTS.NAME_MIN_LENGTH} caracteres` 
      };
    }

    if (trimmedName.length > VALIDATION_CONSTANTS.NAME_MAX_LENGTH) {
      return { 
        isValid: false, 
        error: `El nombre no puede tener más de ${VALIDATION_CONSTANTS.NAME_MAX_LENGTH} caracteres` 
      };
    }

    return { isValid: true, error: null };
  }

  /**
   * 📱 Validar teléfono
   */
  static validatePhone(phone) {
    if (!phone || typeof phone !== 'string') {
      return { isValid: false, error: 'El teléfono es requerido' };
    }

    // Limpiar el teléfono
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    if (!VALIDATION_CONSTANTS.PHONE_REGEX.test(cleanPhone)) {
      return { 
        isValid: false, 
        error: 'Formato de teléfono inválido. Ejemplo: +573123456789' 
      };
    }

    return { isValid: true, error: null };
  }

  /**
   * 📧 Validar email (opcional)
   */
  static validateEmail(email) {
    if (!email) {
      return { isValid: true, error: null }; // Email es opcional
    }

    if (!VALIDATION_CONSTANTS.EMAIL_REGEX.test(email)) {
      return { 
        isValid: false, 
        error: 'Formato de email inválido' 
      };
    }

    return { isValid: true, error: null };
  }

  /**
   * 👤 Validar contacto completo
   */
  static validateContact(contact) {
    const errors = [];

    // Validar nombre
    const nameValidation = this.validateName(contact.nombre);
    if (!nameValidation.isValid) {
      errors.push(nameValidation.error);
    }

    // Validar teléfono
    const phoneValidation = this.validatePhone(contact.telefono);
    if (!phoneValidation.isValid) {
      errors.push(phoneValidation.error);
    }

    // Validar email si está presente
    if (contact.email) {
      const emailValidation = this.validateEmail(contact.email);
      if (!emailValidation.isValid) {
        errors.push(emailValidation.error);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 📍 Validar coordenadas
   */
  static validateCoordinates(latitude, longitude) {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return { isValid: false, error: 'Las coordenadas deben ser números' };
    }

    if (latitude < -90 || latitude > 90) {
      return { isValid: false, error: 'Latitud inválida' };
    }

    if (longitude < -180 || longitude > 180) {
      return { isValid: false, error: 'Longitud inválida' };
    }

    return { isValid: true, error: null };
  }

  /**
   * 🔐 Validar wallet de Ethereum
   */
  static validateEthereumAddress(address) {
    if (!address || typeof address !== 'string') {
      return { isValid: false, error: 'Dirección requerida' };
    }

    // Verificar formato básico de Ethereum
    const ethRegex = /^0x[a-fA-F0-9]{40}$/;
    
    if (!ethRegex.test(address)) {
      return { 
        isValid: false, 
        error: 'Formato de dirección Ethereum inválido' 
      };
    }

    return { isValid: true, error: null };
  }
}

export default Validators;
