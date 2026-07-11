
import express from "express";
import ClienteController from "../controllers/clienteController.js";


const router = express.Router();

router.get("/", ClienteController.getAll);
router.post("/", ClienteController.create);
router.get('/contract/config', ClienteController.getContractConfig); // No olvidar el orden de las rutas, esta debe ir antes de la ruta con :id
router.get("/nft/config", ClienteController.getNFTConfig);
router.get('/:nft/verify-complete/:clienteId/:address',ClienteController.verifyNFTComplete);
router.get("/:id", ClienteController.getById);
router.put("/:id", ClienteController.update);
router.delete("/:id", ClienteController.delete);
router.put('/:id/tx-hash', ClienteController.updateTxHash);
router.get('/:id/validar', ClienteController.validarBlockchain);
router.get('/:id/pdf', ClienteController.generarPDF);

export default router;