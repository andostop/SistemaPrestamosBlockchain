// Configuracion del contrato inteligente para el backend
export const CONTRATO_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_estado",
				"type": "string"
			}
		],
		"name": "actualizarEstado",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_clienteId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_monto",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_plazo",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_interes",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_estado",
				"type": "string"
			}
		],
		"name": "createPrestamo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getPrestamo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export const CONTRATO_DIRECCION = "0x6b38FeA3b31DC4C44e03327aA5d3A1ea3669C757";// Direccion del contrato desplegado

export const GANACHE_URL = "http://localhost:7545";