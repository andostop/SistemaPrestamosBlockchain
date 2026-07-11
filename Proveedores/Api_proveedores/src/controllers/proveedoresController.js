//facturaController.js
import ProveedoresService from '../services/proveedoresService.js';
import {CONTRATO_ABI, CONTRATO_DIRECCION, NFT_ABI, NFT_DIRECCION} from '../config/blockchain_config.js'; 
import ProveedoresNFTService from '../services/proveedoresNFTService.js';


const ProveedoresController = {
    getAll: async (req, res) => {
        console.log('ProveedoresController - Obteniendo todas los proveedores');
        const result = await ProveedoresService.getAll();
        res.json(result);
    },

    create: async (req, res) =>{
        console.log('ProveedoresController - Creando nuevo proveedor');
        const result = await ProveedoresService.create(req.body);
        res.json(result);
    },

    getById: async (req, res) => { 
        console.log(`ProveedoresController - Obteniendo proveedor con ID: ${ req.params.id }`); 
        const result = await ProveedoresService.getById( req.params.id ); 
        res.json(result); 
    },

    update: async (req, res) => { 
        console.log(`ProveedoresController - Actualizando proveedor con ID: ${ req.params.id }`); 
        const result = await ProveedoresService.update( req.params.id , req.body); 
        res.json(result); 
    },

    delete: async (req, res) => { 
        console.log(`ProveedoresController - Eliminando proveedor con ID: ${ req.params.id }`); 
        const result = await ProveedoresService.delete( req.params.id ); 
        res.json(result); 
    },

    updateTxHash: async (req, res) =>{
        console.log(`ProveedoreController - Actualizando hash de transacción para factura con ID: ${ req.params.id}`);
        const { txHash } = req.body;
        const result = await ProveedoresService.updateTxHash(req.params.id, txHash);
        res.json(result);
    },

    getContractConfig: async (req, res) => { 
        console.log('ProveedoresController - Obteniendo configuración del contrato'); 
        res.json({ 
            abi: CONTRATO_ABI, 
            address: CONTRATO_DIRECCION, 
        }); 
    },

    validarBlockchain: async (req, res) => { 
        console.log(`ProveedoreController - Validando proveedor con ID: ${ req.params.id } en blockchain`); 
        try { 
            const result = await ProveedoresService.validarBlockchain( req.params.id ); 
            res.json(result); 
        } catch (error) { 
            console.error('Error al validar en blockchain:', error); 
            res.status(500).json({ error: error.message }); 
        }
    },

    getNFTConfig: async (req, res) => {
        console.log(`ProveedoresController - Obteniendo dirección del contrato NFT`);
        res.json({
            abi: NFT_ABI,
            address: NFT_DIRECCION,
        });
    },

    verifyNFTComplete: async (req, res) => {
        console.log(`ProveedoresController - Verificando NFT completo para el proveedor con ID: ${req.params.proveedoresId} y dirección: ${req.params.address}`);
            try {
                const result = await ProveedoresNFTService.verifyNFTComplete(req.params.proveedoresId, req.params.address);
                res.json(result);
            } catch (error) {
                console.error('Error al verificar el NFT completo:', error);
                res.status(500).json({ error: error.message });
            }
    },

    generarPDF: async (req, res) => {
        console.log(`ProveedoresController - Generando PDF para factura con ID: ${req.params.id}`);
        try{    
            const result = await ProveedoresService.generarPDF(req.params.id);
            res.json(result);
        }catch (error) {
            console.error('Error al generar el PDF:', error);
            res.status(500).json({ error: error.message });
        }
        }
}
export default ProveedoresController;