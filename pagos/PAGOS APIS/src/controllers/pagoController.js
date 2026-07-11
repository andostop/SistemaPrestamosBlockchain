import PagoService from '../services/pagoService.js';
import PagoNFTService from '../services/pagoNFTService.js';
import { CONTRATO_ABI, CONTRATO_DIRECCION, NFT_ABI, NFT_DIRECCION } from '../config/blockchain-config.js'

const PagoController = {

    getAll: async (req, res) => {
        console.log('PagoController - Obteniendo todos los pagos');
        const result = await PagoService.getAll();
        res.json(result);
    },

    create: async (req, res) => {
        console.log('PagoController - Creando un nuevo pago');
        const result = await PagoService.create(req.body);
        res.json(result);
    },

    getById: async (req, res) => {
        console.log('PagoController: Obteniendo pago por ID');
        const result = await PagoService.getById(req.params.id);
        res.json(result);
    },

    update: async (req, res) => {
        console.log('PagoController: Actualizando pago por ID');
        const result = await PagoService.update(req.params.id, req.body);
        res.json(result);
    },

    delete: async (req, res) => {
        console.log('PagoController: Eliminando pago por ID');
        await PagoService.delete(req.params.id);
        res.json({ mensaje: 'Pago eliminado correctamente' });
    },

    updateTxHash: async (req, res) => {
        try {
            console.log(`Actualizando TX para ID: ${req.params.id}`);

            const { txHash } = req.body;

            const result = await PagoService.updateTxHash(req.params.id, txHash);

            res.json(result);
        } catch (error) {
            console.error("ERROR EN updateTxHash:", error);

            res.status(500).json({
                message: "Error interno",
                error: error.message
            });
        }
    },

    getContractConfig: async (req, res) => {
        console.log('PagoController - Obteniendo configuración del contrato');
        res.json({
            abi: CONTRATO_ABI,
            address: CONTRATO_DIRECCION,
        });
    },

    validarBlockchain: async (req, res) => {
        console.log(`PagoController - Validando pago con ID: ${req.params.id} en blockchain`);
        try {
            const result = await PagoService.validarBlockchain(req.params.id);
            res.json(result);
        } catch (error) {
            console.error('Error al validar en blockchain:', error);
            res.status(500).json({ error: error.message });
        }
    },

    getNFTConfig: async (req, res) => {
        console.log('PagoController - Obteniendo dirección del contrato NFT');
        res.json({
            abi: NFT_ABI,
            address: NFT_DIRECCION,
        });
    },

    verifyNFTComplete: async (req, res) => {

        console.log(
            `PagoController - Verificando NFT completo para pago con ID: ${req.params.pagoId} y dirección: ${req.params.address}`
        );

        try {

            const result =
                await PagoNFTService.verifyNFTComplete(
                    req.params.pagoId,
                    req.params.address
                );

            res.json(result);

        } catch (error) {

            console.error(
                'Error al verificar el NFT completo:',
                error
            );

            res.status(500).json({
                error: error.message
            });
        }
    },

    generarPDF: async (req, res) => {
        console.log(`PagoController - Generando PDF para pago con ID: ${req.params.id}`);
        try {
            const result = await PagoService.generarPDF(req.params.id);
            res.json(result);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

export default PagoController;