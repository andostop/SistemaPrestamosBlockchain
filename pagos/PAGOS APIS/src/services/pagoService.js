import PagoRepository from '../repositories/pagoRepository.js';
import Web3 from 'web3';
import { CONTRATO_ABI, CONTRATO_DIRECCION, GANACHE_URL } from '../config/blockchain-config.js';
import PagoPDFService from './pagoPDFService.js';
// Inicializar Web3 y el contrato con ganache
const web3 = new Web3(GANACHE_URL);
const contrato = new web3.eth.Contract(CONTRATO_ABI, CONTRATO_DIRECCION);

const PagoService = {

    getAll: async () => {
        console.log('PagoService: Obteniendo todos los pagos');
        return await PagoRepository.findAll();
    },
    create: async (data) => {
        console.log('PagoService: Creando nuevo pago: ' + JSON.stringify(data));
        return await PagoRepository.insert(data);
    },
    getById: async (id) => {
        console.log('PagoService: Obteniendo pago por ID');
        return await PagoRepository.findById(id);
    },
    update: async (id, data) => {
        console.log('PagoService: Actualizando pago por ID');
        return await PagoRepository.update(id, data);
    },
    delete: async (id) => {
        console.log('PagoService: Eliminando pago por ID');
        return await PagoRepository.delete(id);
    },
    updateTxHash: async (id, txHash) => {
        console.log('PagoService: Actualizando factura con ID ' + id + ' con hash');
        return await PagoRepository.updateTxHash(id, txHash);
    },
    validarBlockchain: async (id) => {
        console.log('PagoService: Validando pago con id ' + id + ' en Blockchain');

        try {
            const pagoDB = await PagoRepository.findById(id);
            const pagoBlockchain = await contrato.methods.getPago(id).call();
            const idCoincide = pagoDB.id.toString() === pagoBlockchain.id.toString();
            const clienteCoincide = pagoDB.cliente_id.toString() === pagoBlockchain.clienteId.toString();
            const montoCoincide =
                Math.round(Number(pagoDB.monto_pagado) * 100)
                ===
                Number(pagoBlockchain.montoPagado);
            const tieneHash = pagoDB.tx_hash_block !== null && pagoDB.tx_hash_block !== '';

            console.log("ID coincide:", idCoincide);
            console.log("Cliente coincide:", clienteCoincide);
            console.log("Monto coincide:", montoCoincide);
            console.log("Tiene hash:", tieneHash);

            console.log("DB:");
            console.log(pagoDB);

            console.log("Blockchain:");
            console.log(pagoBlockchain);

            return {
                valid:
                    idCoincide &&
                    clienteCoincide &&
                    montoCoincide &&
                    tieneHash,
                idCoincide,
                clienteCoincide,
                montoCoincide,
                tieneHash,
                datosDB: {
                    id: pagoDB.id,
                    cliente: pagoDB.cliente_id,
                    monto: pagoDB.monto_pagado,
                    txHash: pagoDB.tx_hash_block
                },
                datosBlockchain: {
                    id: pagoBlockchain.id.toString(),
                    cliente: pagoBlockchain.clienteId.toString(),
                    monto: pagoBlockchain.montoPagado.toString()
                }
            };
        } catch (error) {
            console.error('Error al validar pago en blockchain:', error);
            throw new Error(
                'Error al validar pago en blockchain: ' + error.message
            );
        }
    },
    generarPDF: async (id) => {
        console.log('PagoService: Generando PDF para pago con id ' + id);
        try {
            // Obtener el pago en la DB
            const pagoDB = await PagoRepository.findById(id);
            if (!pagoDB) {
                throw new Error('Pago no encontrado');
            }
            // Implementacion para generar PDF usando la libreria pdfkit
            const pagoPDFService = new PagoPDFService();
            const resultado = await pagoPDFService.generarPagoPDF(pagoDB);
            return resultado;

        } catch (error) {
            console.error('Error al generar el PDF:', error);
            throw new Error('Error al generar el PDF: ' + error.message);
        }
    }
};

export default PagoService;