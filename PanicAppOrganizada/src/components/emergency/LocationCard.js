/**
 * 📍 TARJETA DE UBICACIÓN
 * =======================
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../styles/theme';
import { Formatters } from '../../utils/formatters';
import Card from '../common/Card';

const LocationCard = ({
  location,
  isTracking = false,
  accuracy,
  timestamp,
  onSharePress,
  onViewMapPress,
  style = {},
}) => {
  if (!location) {
    return (
      <Card style={[styles.container, style]}>
        <View style={styles.noLocationContainer}>
          <Text style={styles.noLocationIcon}>📍</Text>
          <Text style={styles.noLocationText}>Ubicación no disponible</Text>
          <Text style={styles.noLocationSubtext}>
            Verifica que el GPS esté activado
          </Text>
        </View>
      </Card>
    );
  }

  const formattedCoords = Formatters.formatCoordinates(
    location.latitude, 
    location.longitude
  );
  
  const formattedTime = timestamp 
    ? Formatters.formatDateTime(timestamp)
    : 'Ahora';
    
  const accuracyText = accuracy 
    ? Formatters.formatAccuracy(accuracy)
    : 'N/A';

  return (
    <Card style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusDot, 
            { backgroundColor: isTracking ? colors.success : colors.medium }
          ]} />
          <Text style={styles.statusText}>
            {isTracking ? 'Compartiendo ubicación' : 'Ubicación obtenida'}
          </Text>
        </View>
        <Text style={styles.timestamp}>{formattedTime}</Text>
      </View>

      {/* Coordenadas */}
      <View style={styles.coordinatesContainer}>
        <Text style={styles.coordinatesLabel}>📍 Coordenadas:</Text>
        <Text style={styles.coordinatesText}>{formattedCoords}</Text>
      </View>

      {/* Precisión */}
      <View style={styles.accuracyContainer}>
        <Text style={styles.accuracyLabel}>🎯 Precisión:</Text>
        <Text style={styles.accuracyText}>{accuracyText}</Text>
        {accuracy && (
          <Text style={styles.accuracyValue}>({Math.round(accuracy)}m)</Text>
        )}
      </View>

      {/* Botones de acción */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]}
          onPress={onSharePress}
        >
          <Text style={styles.primaryButtonText}>📤 Compartir</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={onViewMapPress}
        >
          <Text style={styles.secondaryButtonText}>🗺️ Ver en Mapa</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
  },
  
  // No location state
  noLocationContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  noLocationIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  noLocationText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  noLocationSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  timestamp: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },

  // Coordenadas
  coordinatesContainer: {
    marginBottom: spacing.sm,
  },
  coordinatesLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  coordinatesText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },

  // Precisión
  accuracyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  accuracyLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  accuracyText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    marginRight: spacing.xs,
  },
  accuracyValue: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },

  // Acciones
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.buttonRadius,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  primaryButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textWhite,
  },
  secondaryButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  },
});

export default LocationCard;
