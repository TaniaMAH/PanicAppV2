/**
 * 🔗 BLOCKCHAIN SERVICE - CONFIGURACIÓN REAL
 * ==========================================
 */

import Web3 from 'web3';
import { 
  INFURA_PROJECT_ID, 
  WALLET_PRIVATE_KEY, 
  CONTRACT_ADDRESS 
} from '@env';

// ABI del contrato (del repositorio original)
const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "sender", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "userName", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "latitude", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "longitude", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "AlertSent",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "userName", "type": "string" },
      { "internalType": "string", "name": "latitude", "type": "string" },
      { "internalType": "string", "name": "longitude", "type": "string" }
    ],
    "name": "sendAlert",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "name": "alerts",
    "outputs": [
      { "internalType": "address", "name": "sender", "type": "address" },
      { "internalType": "string", "name": "userName", "type": "string" },
      { "internalType": "string", "name": "latitude", "type": "string" },
      { "internalType": "string", "name": "longitude", "type": "string" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "uint256", "name": "index", "type": "uint256" } ],
    "name": "getAlert",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalAlerts",
    "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "stateMutability": "view",
    "type": "function"
  }
];

class BlockchainService {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.account = null;
    this.isInitialized = false;
  }

  /**
   * 🚀 Inicializar servicio blockchain
   */
  async initialize() {
    try {
      // Usar variables de entorno o fallback a valores por defecto
      const INFURA_URL = `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID || '831151e87ce54ac796a6d2145b93d164'}`;
      const PRIVATE_KEY = WALLET_PRIVATE_KEY || '0x3fc81324939aef640308894c6a61d863f2654528839afd17fe1c14d5405031a4';
      const CONTRACT_ADDR = CONTRACT_ADDRESS || '0xd9145CCE52D386f254917e481eB44e9943F39138';

      console.log('🔗 Inicializando conexión blockchain...');

      // Crear instancia de Web3
      this.web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL));

      // Configurar cuenta desde clave privada
      this.account = this.web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
      this.web3.eth.accounts.wallet.add(this.account);
      console.log('✅ Wallet conectada:', this.account.address);

      // Crear instancia del contrato
      this.contract = new this.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDR);
      
      // Verificar conexión
      const networkId = await this.web3.eth.net.getId();
      console.log('🌐 Red conectada:', networkId, '(Sepolia)');

      // Verificar balance
      const balance = await this.getWalletBalance();
      console.log('💰 Balance:', balance.formatted);

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('❌ Error inicializando blockchain:', error);
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * 🚨 Enviar alerta al blockchain
   */
  async sendEmergencyAlert(userName, latitude, longitude) {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('No se pudo conectar al blockchain');
        }
      }

      console.log('📡 Enviando alerta al blockchain...');
      console.log('👤 Usuario:', userName);
      console.log('📍 Ubicación:', latitude, longitude);

      // Verificar balance antes de enviar
      const balance = await this.getWalletBalance();
      if (balance.eth < 0.001) {
        throw new Error('Balance insuficiente. Necesitas ETH de Sepolia para enviar transacciones.');
      }

      // Preparar transacción
      const gasPrice = await this.web3.eth.getGasPrice();
      const gasLimit = 300000;

      console.log('💰 Gas Price:', this.web3.utils.fromWei(gasPrice, 'gwei'), 'Gwei');

      // Enviar transacción
      const transaction = await this.contract.methods
        .sendAlert(userName, latitude.toString(), longitude.toString())
        .send({
          from: this.account.address,
          gas: gasLimit,
          gasPrice: gasPrice,
        });

      console.log('✅ Transacción exitosa:', transaction.transactionHash);
      console.log('🔗 Ver en Etherscan: https://sepolia.etherscan.io/tx/' + transaction.transactionHash);

      return {
        success: true,
        transactionHash: transaction.transactionHash,
        blockNumber: transaction.blockNumber,
        gasUsed: transaction.gasUsed,
        etherscanUrl: `https://sepolia.etherscan.io/tx/${transaction.transactionHash}`,
      };
    } catch (error) {
      console.error('❌ Error enviando al blockchain:', error);
      
      let userMessage = error.message;
      if (error.message.includes('insufficient funds')) {
        userMessage = 'Balance insuficiente. Necesitas ETH de Sepolia testnet.';
      } else if (error.message.includes('network')) {
        userMessage = 'Error de conexión a la red. Verifica tu internet.';
      }

      return {
        success: false,
        error: userMessage,
      };
    }
  }

  /**
   * 📊 Obtener total de alertas
   */
  async getTotalAlerts() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const total = await this.contract.methods.getTotalAlerts().call();
      return parseInt(total);
    } catch (error) {
      console.error('❌ Error obteniendo total:', error);
      return 0;
    }
  }

  /**
   * 💰 Obtener balance de la wallet
   */
  async getWalletBalance() {
    try {
      if (!this.account) {
        throw new Error('Wallet no conectada');
      }

      const balanceWei = await this.web3.eth.getBalance(this.account.address);
      const balanceEth = this.web3.utils.fromWei(balanceWei, 'ether');
      
      return {
        wei: balanceWei,
        eth: parseFloat(balanceEth),
        formatted: `${parseFloat(balanceEth).toFixed(6)} ETH`,
      };
    } catch (error) {
      console.error('❌ Error obteniendo balance:', error);
      return { wei: '0', eth: 0, formatted: '0.000000 ETH' };
    }
  }

  /**
   * 🔍 Verificar estado de conexión
   */
  async getConnectionStatus() {
    try {
      if (!this.web3) {
        return { connected: false, message: 'Web3 no inicializado' };
      }

      const isConnected = await this.web3.eth.net.isListening();
      const networkId = await this.web3.eth.net.getId();
      const blockNumber = await this.web3.eth.getBlockNumber();
      const balance = await this.getWalletBalance();

      return {
        connected: isConnected,
        networkId,
        blockNumber,
        wallet: this.account?.address,
        balance: balance.formatted,
        message: isConnected ? 'Conectado a Sepolia' : 'Desconectado',
      };
    } catch (error) {
      return { 
        connected: false, 
        message: 'Error de conexión: ' + error.message 
      };
    }
  }

  /**
   * 🧹 Limpiar conexión
   */
  cleanup() {
    this.web3 = null;
    this.contract = null;
    this.account = null;
    this.isInitialized = false;
  }
}

// Exportar instancia singleton
export default new BlockchainService();