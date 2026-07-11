// clienteNFTService.js
import Web3 from 'web3';
import { NFT_ABI, NFT_DIRECCION, GANACHE_URL } from '../config/blockchain-config.js';

const web3 = new Web3(GANACHE_URL);
const contratoNFT = new web3.eth.Contract(NFT_ABI, NFT_DIRECCION);

const ClienteNFTService = {

    // Función completa para verificar NFT de un cliente (tokenId, metadata y propiedad)
    verifyNFTComplete: async (clienteId, address) => {
        console.log('Verificando NFT completo para el cliente:', clienteId, 'y la dirección:', address);

        try {
            // Obtener el tokenId
            const tokenId = await contratoNFT.methods.getTokenId(clienteId).call();

            if (tokenId === '0') {
                return {
                    hasNFT: false,
                    tokenId: 0,
                    metadata: null,
                    ownership: null
                };
            }

            // Obtener la metadata
            const metadata = await contratoNFT.methods.getMetadata(tokenId).call();

            // Verificar la propiedad
            const owner = await contratoNFT.methods.ownerOf(tokenId).call();
            const isOwner = owner.toLowerCase() === address.toLowerCase();

            return {
                hasNFT: true,
                tokenId: tokenId.toString(),
                metadata: {
                    clienteId: metadata.clienteId.toString(),
                    nombre: metadata.nombre,
                    dni: metadata.dni,
                    hash: metadata.hash,
                    timestamp: metadata.timestamp.toString()
                },
                ownership: {
                    owner,
                    isOwner
                }
            };

        } catch (error) {
            console.error('Error al verificar el NFT completo:', error);
            throw new Error('Error al verificar el NFT completo: ' + error.message);
        }
    }
};

export default ClienteNFTService;