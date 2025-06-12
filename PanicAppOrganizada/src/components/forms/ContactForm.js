/**
 * 👤 FORMULARIO DE CONTACTO
 * =========================
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Button from '../common/Button';
import InputField from './InputField';
import Card from '../common/Card';
import { Validators } from '../../utils/validators';
import { Formatters } from '../../utils/formatters';
import { spacing } from '../../styles/theme';

const ContactForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isEditing = false,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    relacion: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Cargar datos iniciales si está editando
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        telefono: initialData.telefono || '',
        email: initialData.email || '',
        relacion: initialData.relacion || '',
      });
    }
  }, [initialData]);

  // Validar formulario en tiempo real
  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    // Validar nombre
    const nameValidation = Validators.validateName(formData.nombre);
    if (!nameValidation.isValid) {
      newErrors.nombre = nameValidation.error;
      valid = false;
    }

    // Validar teléfono
    const phoneValidation = Validators.validatePhone(formData.telefono);
    if (!phoneValidation.isValid) {
      newErrors.telefono = phoneValidation.error;
      valid = false;
    }

    // Validar email (opcional)
    if (formData.email) {
      const emailValidation = Validators.validateEmail(formData.email);
      if (!emailValidation.isValid) {
        newErrors.email = emailValidation.error;
        valid = false;
      }
    }

    setErrors(newErrors);
    setIsValid(valid);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhoneChange = (value) => {
    // Formatear automáticamente el teléfono mientras escribe
    const formatted = Formatters.formatPhone(value);
    handleInputChange('telefono', formatted);
  };

  const handleSubmit = () => {
    if (!isValid) {
      Alert.alert('Errores en el formulario', 'Por favor, corrige los errores antes de continuar.');
      return;
    }

    const contactData = {
      ...formData,
      nombre: formData.nombre.trim(),
      telefono: Formatters.formatPhone(formData.telefono),
      email: formData.email.trim(),
      relacion: formData.relacion.trim() || 'Contacto de emergencia',
    };

    onSubmit(contactData);
  };

  return (
    <Card style={styles.container}>
      <InputField
        label="Nombre completo *"
        value={formData.nombre}
        onChangeText={(value) => handleInputChange('nombre', value)}
        placeholder="Ej: Juan Pérez"
        error={errors.nombre}
        maxLength={50}
        autoCapitalize="words"
        icon={<Text>👤</Text>}
      />

      <InputField
        label="Teléfono *"
        value={formData.telefono}
        onChangeText={handlePhoneChange}
        placeholder="Ej: +573123456789"
        error={errors.telefono}
        keyboardType="phone-pad"
        maxLength={20}
        icon={<Text>📱</Text>}
      />

      <InputField
        label="Email (opcional)"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        placeholder="Ej: juan@email.com"
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        icon={<Text>📧</Text>}
      />

      <InputField
        label="Relación (opcional)"
        value={formData.relacion}
        onChangeText={(value) => handleInputChange('relacion', value)}
        placeholder="Ej: Familiar, Amigo, Compañero"
        maxLength={30}
        autoCapitalize="words"
        icon={<Text>👥</Text>}
      />

      <View style={styles.buttonContainer}>
        <Button
          title={isEditing ? '💾 Actualizar' : '➕ Agregar'}
          onPress={handleSubmit}
          disabled={!isValid || loading}
          loading={loading}
          variant="primary"
          style={styles.submitButton}
        />
        
        {(isEditing || onCancel) && (
          <Button
            title="❌ Cancelar"
            onPress={onCancel}
            variant="outline"
            style={styles.cancelButton}
            disabled={loading}
          />
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  submitButton: {
    flex: 2,
  },
  cancelButton: {
    flex: 1,
  },
});

export default ContactForm;
