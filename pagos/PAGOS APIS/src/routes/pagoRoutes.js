import express from 'express';
import PagoController from '../controllers/pagoController.js';

const router = express.Router();

router.get('/', PagoController.getAll);
router.post('/', PagoController.create);
router.get('/contract/config', PagoController.getContractConfig);
router.get('/nft/config', PagoController.getNFTConfig);
router.get('/nft/verify-complete/:pagoId/:address',PagoController.verifyNFTComplete);
router.get('/:id', PagoController.getById);
router.put('/:id', PagoController.update);
router.delete('/:id', PagoController.delete);
router.put('/:id/txHash', PagoController.updateTxHash);
router.get('/:id/validar', PagoController.validarBlockchain);
router.get('/:id/pdf', PagoController.generarPDF);

export default router;