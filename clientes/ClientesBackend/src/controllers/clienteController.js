import ClienteService from "../services/clienteService.js";
import ClienteNFTService from "../services/clienteNFTService.js";
import {CONTRATO_ABI, CONTRATO_DIRECCION, NFT_ABI, NFT_DIRECCION} from '../config/blockchain-config.js';

const ClienteController = {
    getAll: async (req, res) => {
        console.log("ClienteController - Obteniendo todos los clientes");
        const result = await ClienteService.getAll();
        res.json(result);
    },
    create: async (req, res) => {
        console.log("ClienteController - Creando un nuevo cliente");
        const result = await ClienteService.create(req.body);
        res.json(result);
    },
    getById: async (req, res) => {
        console.log("ClienteController - Obteniendo información de cliente");
        const result = await ClienteService.getById(req.params.id);
        res.json(result);
    },
    update: async (req, res) => {
        console.log("ClienteController - Actualizando datos de un cliente");
        const result = await ClienteService.update(req.params.id, req.body);
        res.json(result);
    },
    delete: async (req, res) => {
        console.log("ClienteController - Borrando un cliente");
        await ClienteService.delete(req.params.id);
        res.json({ mensaje: "Cliente eliminado correctamente" });
    },
    updateTxHash: async (req, res) => {
        console.log('ClienteController - Actualizando hash de transacción cliente con ID: ${req.params.id}');
        const { txHash } = req.body;
        const result = await ClienteService.updateTxHash(req.params.id, txHash);
        res.json(result);
    },
    getContractConfig: async (req, res) => {
        console.log('ClienteController - Obteniendo configuración del contrato');
        res.json({
            abi: CONTRATO_ABI,
            address: CONTRATO_DIRECCION,
        });
    },
    validarBlockchain: async (req, res) => {
        console.log('ClienteController - Validando cliente con ID: ${req.params.id} en blockchain');
        try {
            const result = await ClienteService.validarBlockchain(req.params.id);
            res.json(result);
        } catch (error) {
            console.error('Error al validar en blockchain:', error);
            res.status(500).json({ error: error.message });
        }
    },
    getNFTConfig: async (req, res) => {
        console.log('ClienteController - Obteniendo configuración del contrato NFT');
        res.json({
            abi: NFT_ABI,
            address: NFT_DIRECCION,
        });
    },
    verifyNFTComplete: async (req, res) => {
        console.log(`ClienteController - Verificando NFT completo para cliente con ID: ${req.params.clienteId} y dirección: ${req.params.address}`);

        try {
            const result = await ClienteNFTService.verifyNFTComplete(req.params.clienteId, req.params.address);
            res.json(result);
        } catch (error) {
            console.error('Error al verificar el NFT completo:', error);
            res.status(500).json({ error: error.message });
        }
    },
    generarPDF: async (req, res) => {
        console.log('ClienteController - Generando PDF para factura con ID: ${req.params.id}');
        try{
            const result = await ClienteService.generarPDF(req.params.id);
            res.json(result);
        }catch (error) {
            console.error('Error al generar el PDF:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

export default ClienteController;