/**
 * 🔐 CONFIGURACIÓN WEB3 SEGURA
 * ============================
 */

// Simulación de variables de entorno para React Native
// En un proyecto real, usarías react-native-config
const ENV_CONFIG = {
  INFURA_PROJECT_ID: '831151e87ce54ac796a6d2145b93d164',
  WALLET_PRIVATE_KEY: '<gE08<IqQ6on',
  CONTRACT_ADDRESS: '0xd9145CCE52D386f254917e481eB44e9943F39138',
  BLOCKCHAIN_NETWORK: 'sepolia',
  DEFAULT_WALLET_ADDRESS: '0x530730bCe83A56AD860cb4fBcFFf8aD82AFd945f',
};

// 🔐 Configuración de blockchain
export const BLOCKCHAIN_CONFIG = {
  INFURA_URL: `https://sepolia.infura.io/v3/${ENV_CONFIG.INFURA_PROJECT_ID}`,
  PRIVATE_KEY: ENV_CONFIG.WALLET_PRIVATE_KEY,
  CONTRACT_ADDRESS: ENV_CONFIG.CONTRACT_ADDRESS,
  NETWORK: ENV_CONFIG.BLOCKCHAIN_NETWORK,
  DEFAULT_WALLET: ENV_CONFIG.DEFAULT_WALLET_ADDRESS,
};

// ABI del contrato (del repositorio original)
export const CONTRACT_ABI = [
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

// Función para obtener configuración
export const getBlockchainConfig = () => {
  return BLOCKCHAIN_CONFIG;
};

// Función para obtener ABI del contrato
export const getContractABI = () => {
  return CONTRACT_ABI;
};

// Validar configuración
export const validateConfig = () => {
  const config = BLOCKCHAIN_CONFIG;
  
  if (!config.INFURA_URL || !config.CONTRACT_ADDRESS) {
    throw new Error('Configuración de blockchain incompleta');
  }
  
  return true;
};

export default {
  BLOCKCHAIN_CONFIG,
  CONTRACT_ABI,
  getBlockchainConfig,
  getContractABI,
  validateConfig,
};
