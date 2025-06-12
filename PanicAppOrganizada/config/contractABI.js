/**
 * 📄 ABI REAL DE SMART CONTRACT
 * ================================
 * Extraída del archivo utils/web3Config.js original
 * Contrato: 0xd9145CCE52D386f254917e481eB44e9943F39138
 */

export const PANIC_APP_ABI = [
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

/**
 * 📊 ANÁLISIS DE SMART CONTRACT
 * ================================
 */

// 🎯 FUNCIONES DISPONIBLES:
// 1. sendAlert(userName, latitude, longitude) - Enviar alerta de emergencia
// 2. alerts(index) - Obtener alerta por índice
// 3. getAlert(index) - Obtener alerta completa por índice  
// 4. getTotalAlerts() - Obtener total de alertas registradas

// 📡 EVENTOS:
// 1. AlertSent - Se emite cuando se envía una alerta con todos los datos

// 📍 DATOS QUE ALMACENA CADA ALERTA:
// - sender: Dirección de la wallet que envió la alerta
// - userName: Nombre del usuario
// - latitude: Latitud como string
// - longitude: Longitud como string
// - timestamp: Timestamp de cuando se registró

// 🔗 CONFIGURACIÓN COMPLETA:
export const CONTRACT_CONFIG = {
  address: '0xd9145CCE52D386f254917e481eB44e9943F39138',
  abi: PANIC_APP_ABI,
  network: 'sepolia',
  infuraUrl: 'https://sepolia.infura.io/v3/831151e87ce54ac796a6d2145b93d164'
};

export default PANIC_APP_ABI;