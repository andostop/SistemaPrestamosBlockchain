// facturaNFTService.js
import Web3 from 'web3';
import { NFT_ABI, NFT_DIRECCION, GANACHE_URL } from '../config/blockchain_config.js';

const web3 = new Web3(GANACHE_URL);
const contratoNFT = new web3.eth.Contract(NFT_ABI, NFT_DIRECCION);

const ProveedoresNFTService = {

//Funcion completa para verificar NFT de una proveedor (tokenId, metadata y propiedad)
verifyNFTComplete: async (proveedoresId, address) => {
console.log('Verificando NFT completo para el proveedor:', proveedoresId, 'y la dirección:', address);
try {
// Obtenemos el tokenId
const tokenId = await contratoNFT.methods.getTokenId(proveedoresId).call();
        if (tokenId === '0') {
            return {
                hasNFT: false,
                tokenId: 0,
                metadata: null,
                ownership: null
            }
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
            proveedoresId: metadata.proveedoresId.toString(),
            cuenta: metadata.cuenta,
            correo: metadata.correo,
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

}
export default ProveedoresNFTService;