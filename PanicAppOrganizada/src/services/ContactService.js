/**
 * 👥 CONTACT SERVICE
 * ==================
 * Gestión avanzada de contactos de emergencia
 */

import { Linking, Alert } from 'react-native';
import StorageService from './StorageService';

class ContactService {
  /**
   * ✅ Validar número de teléfono
   */
  static validatePhoneNumber(phone) {
    // Remover espacios y caracteres especiales
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Verificar que sea un número válido
    const phoneRegex = /^[\+]?[0-9]{7,15}$/;
    return phoneRegex.test(cleanPhone);
  }

  /**
   * 🔧 Formatear número de teléfono
   */
  static formatPhoneNumber(phone) {
    let cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Si no tiene código de país, agregar +57 (Colombia)
    if (!cleanPhone.startsWith('+')) {
      if (cleanPhone.length === 10 || cleanPhone.length === 7) {
        cleanPhone = '+57' + cleanPhone;
      }
    }
    
    return cleanPhone;
  }

  /**
   * ✅ Validar datos de contacto
   */
  static validateContact(contact) {
    const errors = [];

    // Validar nombre
    if (!contact.nombre || contact.nombre.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    // Validar teléfono
    if (!contact.telefono || !this.validatePhoneNumber(contact.telefono)) {
      errors.push('El número de teléfono no es válido');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * ➕ Agregar contacto
   */
  static async addContact(contactData) {
    try {
      // Validar datos
      const validation = this.validateContact(contactData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('\n'));
      }

      // Formatear teléfono
      const formattedPhone = this.formatPhoneNumber(contactData.telefono);

      // Verificar duplicados
      const existingContacts = await StorageService.getContacts();
      const isDuplicate = existingContacts.some(
        contact => contact.telefono === formattedPhone
      );

      if (isDuplicate) {
        throw new Error('Ya existe un contacto con ese número de teléfono');
      }

      // Crear contacto
      const newContact = {
        id: Date.now().toString(),
        nombre: contactData.nombre.trim(),
        telefono: formattedPhone,
        email: contactData.email || '',
        relacion: contactData.relacion || 'Contacto de emergencia',
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      // Guardar
      const success = await StorageService.addContact(newContact);
      if (success) {
        console.log('✅ Contacto agregado:', newContact);
        return { success: true, contact: newContact };
      } else {
        throw new Error('Error guardando el contacto');
      }
    } catch (error) {
      console.error('❌ Error agregando contacto:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * ✏️ Editar contacto
   */
  static async editContact(contactId, updatedData) {
    try {
      // Validar datos
      const validation = this.validateContact(updatedData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('\n'));
      }

      const contacts = await StorageService.getContacts();
      const contactIndex = contacts.findIndex(c => c.id === contactId);

      if (contactIndex === -1) {
        throw new Error('Contacto no encontrado');
      }

      // Formatear teléfono
      const formattedPhone = this.formatPhoneNumber(updatedData.telefono);

      // Verificar duplicados (excluyendo el contacto actual)
      const isDuplicate = contacts.some(
        (contact, index) => 
          contact.telefono === formattedPhone && index !== contactIndex
      );

      if (isDuplicate) {
        throw new Error('Ya existe otro contacto con ese número de teléfono');
      }

      // Actualizar contacto
      contacts[contactIndex] = {
        ...contacts[contactIndex],
        nombre: updatedData.nombre.trim(),
        telefono: formattedPhone,
        email: updatedData.email || '',
        relacion: updatedData.relacion || 'Contacto de emergencia',
        updatedAt: new Date().toISOString(),
      };

      // Guardar cambios
      const success = await StorageService.saveContacts(contacts);
      if (success) {
        console.log('✅ Contacto actualizado:', contacts[contactIndex]);
        return { success: true, contact: contacts[contactIndex] };
      } else {
        throw new Error('Error guardando los cambios');
      }
    } catch (error) {
      console.error('❌ Error editando contacto:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 🗑️ Eliminar contacto
   */
  static async deleteContact(contactId) {
    try {
      const success = await StorageService.removeContact(contactId);
      if (success) {
        console.log('🗑️ Contacto eliminado:', contactId);
        return { success: true };
      } else {
        throw new Error('Error eliminando el contacto');
      }
    } catch (error) {
      console.error('❌ Error eliminando contacto:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 📱 Enviar mensaje por WhatsApp
   */
  static async sendWhatsAppMessage(phoneNumber, message) {
    try {
      const formattedPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
      
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
        return { success: true };
      } else {
        throw new Error('WhatsApp no está disponible');
      }
    } catch (error) {
      console.error('❌ Error enviando WhatsApp:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 📧 Enviar mensaje a todos los contactos
   */
  static async sendMessageToAllContacts(message, userName = 'Usuario') {
    try {
      const contacts = await StorageService.getContacts();
      
      if (contacts.length === 0) {
        throw new Error('No hay contactos configurados');
      }

      const results = [];

      for (const contact of contacts) {
        if (!contact.isActive) continue;

        const personalizedMessage = message.replace('{userName}', userName);
        const result = await this.sendWhatsAppMessage(contact.telefono, personalizedMessage);
        
        results.push({
          contact: contact.nombre,
          phone: contact.telefono,
          success: result.success,
          error: result.error || null,
        });

        // Pequeña pausa entre envíos
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      console.log(`📱 Mensajes enviados: ${successCount} exitosos, ${failCount} fallidos`);

      return {
        success: successCount > 0,
        results,
        summary: {
          total: contacts.length,
          sent: successCount,
          failed: failCount,
        },
      };
    } catch (error) {
      console.error('❌ Error enviando mensajes:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 🧪 Probar contacto
   */
  static async testContact(contact) {
    const testMessage = `🧪 Mensaje de prueba de PanicApp\n\nHola ${contact.nombre}, este es un mensaje de prueba para verificar que puedes recibir alertas de emergencia.\n\n✅ Si recibes este mensaje, todo está funcionando correctamente.`;
    
    return await this.sendWhatsAppMessage(contact.telefono, testMessage);
  }

  /**
   * 📊 Obtener estadísticas de contactos
   */
  static async getContactStats() {
    try {
      const contacts = await StorageService.getContacts();
      const activeContacts = contacts.filter(c => c.isActive);
      
      return {
        total: contacts.length,
        active: activeContacts.length,
        inactive: contacts.length - activeContacts.length,
        hasContacts: contacts.length > 0,
        isConfigured: activeContacts.length > 0,
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        hasContacts: false,
        isConfigured: false,
      };
    }
  }
}

export default ContactService;
