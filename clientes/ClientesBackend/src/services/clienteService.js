import ClienteRepository from '../repositories/clienteRepository.js';
import Web3 from 'web3';
import {CONTRATO_ABI, CONTRATO_DIRECCION, GANACHE_URL} from '../config/blockchain-config.js';
import ClientePdfService from './clientePdfService.js';

// Inicializar Web3 y el contrato con ganache
const web3 = new Web3(GANACHE_URL);
const contrato = new web3.eth.Contract(CONTRATO_ABI, CONTRATO_DIRECCION);


const ClienteService = {
    getAll: async () => {
        console.log('ClienteService - Obteniendo todos los clientes');
        return await ClienteRepository.findAll();
    },
    create: async (data) => {
        console.log('ClienteService - Creando cliente: ' + JSON.stringify(data));
        return await ClienteRepository.insert(data);
    },
    getById: async (id) => {
        console.log('ClienteService - Obteniendo cliente por ID: ' + id);
        return await ClienteRepository.findById(id);
    },
    update: async (id, data) => {
        console.log('ClienteService - Actualizando cliente ID: ' + id + ' con datos: ' + JSON.stringify(data));
        return await ClienteRepository.update(id, data);
    },
    delete: async (id) => {
        console.log('ClienteService - Eliminando cliente ID: ' + id);
        return await ClienteRepository.delete(id);
    },
    updateTxHash: async (id, txHash) => {
        console.log('ClienteService: Actualizando cliente con id ' + id + ' con hash ' + txHash);
        return await ClienteRepository.updateTxHash(id, txHash);
    },
    validarBlockchain: async (id) => {
        console.log('ClienteService: Validando cliente con id ' + id + ' en blockchain');
        try {
            //Obtener el cliente de la base de datos
            const clienteDB = await ClienteRepository.findById(id); 

            // Obtener cliente de la blockchain con el metodo getCliente dentro
            const clienteBlockchain = await contrato.methods.getCliente(id).call();

             // Compara datos
            const idCoincide      = clienteDB.id.toString()    === clienteBlockchain.id.toString();
            const nombreCoincide = clienteDB.nombre         === clienteBlockchain.nombre;
            const dniCoincide   = clienteDB.dni.toString() === clienteBlockchain.dni;
            const tieneHash       = clienteDB.tx_hash_block !== null;// Si tiene hash o esta vacio

            console.log(clienteDB.tx_hash_block);
            return {
            valid: idCoincide && nombreCoincide && dniCoincide && tieneHash, //true o false
            idCoincide,
            nombreCoincide,
            dniCoincide,
            tieneHash,
            datosDB: {
                id: clienteDB.id,
                nombre: clienteDB.nombre,
                dni: clienteDB.dni,
                txHash: clienteDB.tx_hash_block
            },
            datosBlockchain: {
                id: clienteBlockchain.id.toString(),
                nombre: clienteBlockchain.nombre,
                dni: clienteBlockchain.dni
            }
        };

        } catch (error) {
            console.error('Error al validar cliente en blockchain:', error);
            throw new Error('Error al validar cliente en blockchain: ' + error.message);
        }
    },

    generarPDF: async (id) => {
        console.log('ClienteService: Generando PDF para cliente con id ' + id);
        try {
            // Obtener el cliente de la base de datos
            const clienteDB = await ClienteRepository.findById(id);
            if (!clienteDB) {
            throw new Error('Cliente no encontrado');
            }
            // Implementacion para generar PDF usando la libreria pdfkit
            const clientePdfService = new ClientePdfService();
            const resultado = await clientePdfService.generarClientePDF(clienteDB);
            return resultado;
            } catch (error) {
                console.error('Error al generar el PDF:', error);
                throw new Error('Error al generar el PDF: ' + error.message);
            }
    }
};

export default ClienteService;