/**
 * 👥 PANTALLA DE CONTACTOS
 * ========================
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ContactForm from '../../components/forms/ContactForm';
import { colors, spacing, typography } from '../../styles/theme';
import ContactService from '../../services/ContactService';
import StorageService from '../../services/StorageService';

const ContactsScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const contactsList = await StorageService.getContacts();
      setContacts(contactsList);
    } catch (error) {
      console.error('Error cargando contactos:', error);
      Alert.alert('Error', 'No se pudieron cargar los contactos');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadContacts();
    setRefreshing(false);
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleDeleteContact = (contact) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar a ${contact.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await ContactService.deleteContact(contact.id);
            if (result.success) {
              Alert.alert('✅ Eliminado', 'Contacto eliminado correctamente');
              loadContacts();
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const handleTestContact = async (contact) => {
    const result = await ContactService.testContact(contact);
    if (result.success) {
      Alert.alert('✅ Mensaje enviado', 'Se envió un mensaje de prueba');
    } else {
      Alert.alert('❌ Error', result.error || 'No se pudo enviar el mensaje');
    }
  };

  const handleFormSubmit = async (contactData) => {
    setFormLoading(true);
    
    try {
      let result;
      
      if (editingContact) {
        result = await ContactService.editContact(editingContact.id, contactData);
      } else {
        result = await ContactService.addContact(contactData);
      }

      if (result.success) {
        Alert.alert(
          '✅ Éxito',
          editingContact ? 'Contacto actualizado correctamente' : 'Contacto agregado correctamente'
        );
        setShowForm(false);
        setEditingContact(null);
        loadContacts();
      } else {
        Alert.alert('❌ Error', result.error);
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Ocurrió un error inesperado');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  const renderContactItem = ({ item }) => (
    <Card style={styles.contactCard}>
      <View style={styles.contactHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.nombre.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.nombre}</Text>
          <Text style={styles.contactPhone}>{item.telefono}</Text>
          {item.relacion && (
            <Text style={styles.contactRelation}>{item.relacion}</Text>
          )}
        </View>
      </View>

      <View style={styles.contactActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.testButton]}
          onPress={() => handleTestContact(item)}
        >
          <Text style={styles.actionButtonText}>📱</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditContact(item)}
        >
          <Text style={styles.actionButtonText}>✏️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteContact(item)}
        >
          <Text style={styles.actionButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>👥</Text>
      <Text style={styles.emptyStateText}>No hay contactos</Text>
      <Text style={styles.emptyStateSubtext}>
        Agrega al menos un contacto de emergencia para poder usar la aplicación
      </Text>
      <Button
        title="➕ Agregar primer contacto"
        onPress={handleAddContact}
        variant="primary"
        style={styles.emptyStateButton}
      />
    </View>
  );

  if (showForm) {
    return (
      <View style={styles.container}>
        <Header
          title={editingContact ? 'Editar Contacto' : 'Agregar Contacto'}
          leftIcon={<Text style={styles.headerIcon}>←</Text>}
          onLeftPress={handleFormCancel}
        />
        <View style={styles.formContainer}>
          <ContactForm
            initialData={editingContact}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isEditing={!!editingContact}
            loading={formLoading}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Contactos de Emergencia"
        subtitle={`${contacts.length} contacto${contacts.length !== 1 ? 's' : ''} configurado${contacts.length !== 1 ? 's' : ''}`}
        rightIcon={<Text style={styles.headerIcon}>➕</Text>}
        onRightPress={handleAddContact}
      />

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContactItem}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {contacts.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💡 Estos contactos recibirán alertas automáticamente cuando actives el botón de pánico
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  formContainer: {
    flex: 1,
    padding: spacing.screenPadding,
  },
  listContent: {
    padding: spacing.screenPadding,
    flexGrow: 1,
  },

  // Header icons
  headerIcon: {
    fontSize: 20,
    color: colors.textWhite,
  },

  // Contact card
  contactCard: {
    marginBottom: spacing.md,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.textWhite,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  contactPhone: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  contactRelation: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },

  // Actions
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  testButton: {
    backgroundColor: colors.secondary,
  },
  editButton: {
    backgroundColor: colors.warning,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  actionButtonText: {
    fontSize: typography.sizes.md,
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
    opacity: 0.5,
  },
  emptyStateText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  emptyStateButton: {
    minWidth: 200,
  },

  // Footer
  footer: {
    backgroundColor: colors.info + '20',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.lighter,
  },
  footerText: {
    fontSize: typography.sizes.sm,
    color: colors.info,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ContactsScreen;
