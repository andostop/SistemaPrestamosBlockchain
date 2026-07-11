//ProveedoresRoutes.js
import express from 'express';
import ProveedoresController from '../controllers/proveedoresController.js';


const router = express.Router();

router.get('/', ProveedoresController.getAll);
router.post('/', ProveedoresController.create);
router.get('/contract/config', ProveedoresController.getContractConfig); //ORDEN
router.get('/nft/config', ProveedoresController.getNFTConfig);
router.get('/:nft/verify-complete/:proveedoresId/:address',ProveedoresController.verifyNFTComplete);
router.get('/:id', ProveedoresController.getById); 
router.put('/:id', ProveedoresController.update); 
router.delete('/:id', ProveedoresController.delete);
router.put('/:id/tx-hash', ProveedoresController.updateTxHash);
router.get('/:id/validar', ProveedoresController.validarBlockchain);
router.get('/:id/pdf', ProveedoresController.generarPDF);

export default router;