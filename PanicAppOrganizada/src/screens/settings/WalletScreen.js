/**
 * 💰 PANTALLA DE WALLET COMPLETA
 * ==============================
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { colors, spacing, typography } from '../../styles/theme';
import BlockchainService from '../../services/BlockchainService';

const WalletScreen = ({ navigation }) => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [wallet] = useState('0x530730bCe83A56AD860cb4fBcFFf8aD82AFd945f');

  useEffect(() => {
    checkBlockchainConnection();
  }, []);

  const checkBlockchainConnection = async () => {
    setLoading(true);
    try {
      // Verificar estado de conexión
      const status = await BlockchainService.getConnectionStatus();
      setConnectionStatus(status);
      
      // Obtener total de alertas si está conectado
      if (status.connected) {
        const total = await BlockchainService.getTotalAlerts();
        setTotalAlerts(total);
      }
    } catch (error) {
      console.error('Error verificando blockchain:', error);
      Alert.alert('Error', 'No se pudo conectar al blockchain');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const initialized = await BlockchainService.initialize();
      if (initialized) {
        Alert.alert('✅ Conexión exitosa', 'Blockchain conectado correctamente');
        checkBlockchainConnection();
      } else {
        Alert.alert('❌ Error', 'No se pudo conectar al blockchain');
      }
    } catch (error) {
      Alert.alert('❌ Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewEtherscan = () => {
    const url = `https://sepolia.etherscan.io/address/${wallet}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir Etherscan');
    });
  };

  const handleWalletInfo = () => {
    Alert.alert(
      '💰 Información de Wallet',
      'Esta es una wallet de demostración configurada para la red Sepolia de Ethereum.\n\n• Se usa para registrar alertas de forma inmutable\n• Las transacciones son gratuitas en testnet\n• Todos los registros son públicos y verificables',
      [{ text: 'Entendido' }]
    );
  };

  const handleGetTestEth = () => {
    Alert.alert(
      '🚰 Obtener ETH de prueba',
      'Para usar esta función necesitas ETH de la red Sepolia (testnet).\n\n¿Quieres ir al faucet para obtener ETH gratuito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ir al Faucet',
          onPress: () => Linking.openURL('https://sepoliafaucet.com/'),
        },
      ]
    );
  };

  const renderConnectionStatus = () => {
    if (!connectionStatus) return null;

    const statusColor = connectionStatus.connected ? colors.success : colors.danger;
    const statusIcon = connectionStatus.connected ? '🟢' : '🔴';

    return (
      <Card style={[styles.statusCard, { borderColor: statusColor }]}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusIcon}>{statusIcon}</Text>
          <Text style={[styles.statusTitle, { color: statusColor }]}>
            {connectionStatus.message}
          </Text>
        </View>
        
        {connectionStatus.connected && (
          <View style={styles.statusDetails}>
            <Text style={styles.statusItem}>
              🌐 Red: {connectionStatus.networkId} (Sepolia)
            </Text>
            <Text style={styles.statusItem}>
              📦 Bloque: {connectionStatus.blockNumber}
            </Text>
            <Text style={styles.statusItem}>
              💰 Balance: {connectionStatus.balance}
            </Text>
            <Text style={styles.statusItem}>
              🚨 Alertas registradas: {totalAlerts}
            </Text>
          </View>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Configuración Blockchain"
        subtitle="Wallet y registros seguros"
        leftIcon={<Text style={styles.headerIcon}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Estado de conexión */}
        {renderConnectionStatus()}

        {/* Wallet Card */}
        <Card style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Text style={styles.walletIcon}>💰</Text>
            <Text style={styles.walletTitle}>Wallet Ethereum</Text>
          </View>
          
          <View style={styles.walletAddressContainer}>
            <Text style={styles.walletLabel}>Dirección configurada:</Text>
            <Text style={styles.walletAddress}>{wallet}</Text>
          </View>

          <View style={styles.walletActions}>
            <Button
              title="🔗 Ver en Etherscan"
              onPress={handleViewEtherscan}
              variant="secondary"
              size="small"
              style={styles.walletButton}
            />
            
            <Button
              title="ℹ️ Información"
              onPress={handleWalletInfo}
              variant="outline"
              size="small"
              style={styles.walletButton}
            />
          </View>
        </Card>

        {/* Acciones */}
        <Card style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>🔧 Acciones</Text>
          
          <Button
            title={loading ? "Probando..." : "🧪 Probar Conexión"}
            onPress={handleTestConnection}
            disabled={loading}
            variant="primary"
            style={styles.actionButton}
          />
          
          <Button
            title="🚰 Obtener ETH de prueba"
            onPress={handleGetTestEth}
            variant="warning"
            style={styles.actionButton}
          />
          
          <Button
            title="🔄 Actualizar Estado"
            onPress={checkBlockchainConnection}
            disabled={loading}
            variant="outline"
            style={styles.actionButton}
          />
        </Card>

        {/* Información */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>🔐 ¿Qué es la integración blockchain?</Text>
          <Text style={styles.infoText}>
            La tecnología blockchain permite registrar las emergencias de forma inmutable y transparente, creando un historial verificable de todas las alertas enviadas.
          </Text>
        </Card>

        {/* Características */}
        <Card style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>✨ Características</Text>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔒</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Seguridad</Text>
              <Text style={styles.featureText}>Registros inmutables y encriptados</Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🌐</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Transparencia</Text>
              <Text style={styles.featureText}>Verificación pública de emergencias</Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📊</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Trazabilidad</Text>
              <Text style={styles.featureText}>Historial completo de alertas</Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⚡</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Rapidez</Text>
              <Text style={styles.featureText}>Registro instantáneo en la red</Text>
            </View>
          </View>
        </Card>

        {/* Nota importante */}
        <Card style={styles.noteCard}>
          <Text style={styles.noteTitle}>📝 Nota importante</Text>
          <Text style={styles.noteText}>
            Esta configuración usa la red Sepolia (testnet) de Ethereum para pruebas. En producción se usaría la red principal (mainnet) con ETH real.
          </Text>
        </Card>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Conectando con blockchain...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  
  // Header
  headerIcon: {
    fontSize: 20,
    color: colors.textWhite,
  },

  // Status card
  statusCard: {
    margin: spacing.screenPadding,
    marginBottom: spacing.md,
    borderWidth: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  statusTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  statusDetails: {
    backgroundColor: colors.lighter,
    borderRadius: spacing.inputRadius,
    padding: spacing.sm,
  },
  statusItem: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },

  // Wallet card
  walletCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  walletHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  walletIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  walletTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  walletAddressContainer: {
    marginBottom: spacing.lg,
  },
  walletLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  walletAddress: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.secondary,
    textAlign: 'center',
    fontFamily: 'monospace',
    backgroundColor: colors.lighter,
    padding: spacing.sm,
    borderRadius: spacing.inputRadius,
  },
  walletActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing.sm,
  },
  walletButton: {
    flex: 1,
  },

  // Actions card
  actionsCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  actionsTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  actionButton: {
    marginBottom: spacing.sm,
  },

  // Info card
  infoCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
    backgroundColor: colors.secondary + '20',
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  infoTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.secondary,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.secondary,
    lineHeight: 20,
  },

  // Features card
  featuresCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  featuresTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  featureText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },

  // Note card
  noteCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.xl,
    backgroundColor: colors.warning + '20',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  noteTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.warning,
    marginBottom: spacing.sm,
  },
  noteText: {
    fontSize: typography.sizes.sm,
    color: colors.warning,
    lineHeight: 20,
  },

  // Loading
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
});

export default WalletScreen;