import PrestamoService from '../services/prestamoService.js';
import {CONTRATO_ABI, CONTRATO_DIRECCION} from '../config/blockchain-config.js';

const PrestamoController = {

    getAll: async (req,res) => {

        const result =
        await PrestamoService.getAll();

        res.json(result);

    },

    create: async (req,res) => {

        const result =
        await PrestamoService.create(
            req.body
        );

        res.json(result);

    },

    getById: async (req,res) => {

        const result =
        await PrestamoService.getById(
            req.params.id
        );

        res.json(result);

    },

    update: async (req,res) => {

        const result =
        await PrestamoService.update(
            req.params.id,
            req.body
        );

        res.json(result);

    },

    delete: async (req,res) => {

        const result =
        await PrestamoService.delete(
            req.params.id
        );

        res.json(result);

    },

    updateTxHash: async (req,res) => {

        const { txHash } =
        req.body;

        const result =
        await PrestamoService.updateTxHash(
            req.params.id,
            txHash
        );

        res.json(result);

    },

    getContractConfig: async (req,res) => {

        res.json({
            abi: CONTRATO_ABI,
            address: CONTRATO_DIRECCION
        });

    },

    validarBlockchain: async (req, res) => {
        try {

            const result =
            await PrestamoService.validarBlockchain(
                req.params.id
            );

            res.json(result);

        } catch (error) {

            console.error(
                'Error al validar en blockchain:',
                error
            );

            res.status(500).json({
                error: error.message
            });

        }
    }

};

export default PrestamoController;