/**
 * 👥 HOOK PARA GESTIÓN DE CONTACTOS
 * =================================
 */

import { useState, useEffect } from 'react';
import ContactService from '../services/ContactService';
import StorageService from '../services/StorageService';

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    isConfigured: false,
  });

  // Cargar contactos
  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const contactsList = await StorageService.getContacts();
      setContacts(contactsList);
      
      // Actualizar estadísticas
      const contactStats = await ContactService.getContactStats();
      setStats(contactStats);
      
      return contactsList;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Agregar contacto
  const addContact = async (contactData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await ContactService.addContact(contactData);
      
      if (result.success) {
        await loadContacts(); // Recargar lista
        return { success: true, contact: result.contact };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err.message || 'Error agregando contacto';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Editar contacto
  const editContact = async (contactId, contactData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await ContactService.editContact(contactId, contactData);
      
      if (result.success) {
        await loadContacts(); // Recargar lista
        return { success: true, contact: result.contact };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err.message || 'Error editando contacto';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar contacto
  const deleteContact = async (contactId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await ContactService.deleteContact(contactId);
      
      if (result.success) {
        await loadContacts(); // Recargar lista
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err.message || 'Error eliminando contacto';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Probar contacto
  const testContact = async (contact) => {
    setError(null);
    
    try {
      const result = await ContactService.testContact(contact);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Error probando contacto';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Enviar mensaje a todos
  const sendToAllContacts = async (message, userName) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await ContactService.sendMessageToAllContacts(message, userName);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Error enviando mensajes';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Cargar contactos al montar
  useEffect(() => {
    loadContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
    stats,
    loadContacts,
    addContact,
    editContact,
    deleteContact,
    testContact,
    sendToAllContacts,
  };
};

export default useContacts;
