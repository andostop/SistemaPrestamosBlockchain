// pagoNFTService.js
import Web3 from 'web3';
import {
    NFT_ABI,
    NFT_DIRECCION,
    GANACHE_URL
} from '../config/blockchain-config.js';

const web3 = new Web3(GANACHE_URL);
const contratoNFT = new web3.eth.Contract(
    NFT_ABI,
    NFT_DIRECCION
);

const PagoNFTService = {

    // Función completa para verificar NFT de un pago
    verifyNFTComplete: async (pagoId, address) => {

        console.log(
            'Verificando NFT completo para el pago:',
            pagoId,
            'y la dirección:',
            address
        );

        try {

            // Obtener el Token ID
            const tokenId =
                await contratoNFT.methods
                    .getTokenId(pagoId)
                    .call();

            if (tokenId === '0') {
                return {
                    hasNFT: false,
                    tokenId: 0,
                    metadata: null,
                    ownership: null
                };
            }

            // Obtener la metadata
            const metadata =
                await contratoNFT.methods
                    .getMetadata(tokenId)
                    .call();

            // Verificar el propietario
            const owner =
                await contratoNFT.methods
                    .ownerOf(tokenId)
                    .call();

            const isOwner =
                owner.toLowerCase() === address.toLowerCase();

            return {
                hasNFT: true,
                tokenId: tokenId.toString(),
                metadata: {
                    pagoId: metadata.pagoId.toString(),
                    clienteId: metadata.clienteId.toString(),
                    montoPagado: metadata.montoPagado.toString(),
                    hash: metadata.hash,
                    timestamp: metadata.timestamp.toString()
                },
                ownership: {
                    owner,
                    isOwner
                }
            };

        } catch (error) {

            console.error(
                'Error al verificar el NFT completo:',
                error
            );

            throw new Error(
                'Error al verificar el NFT completo: ' +
                error.message
            );
        }
    }
};

export default PagoNFTService;