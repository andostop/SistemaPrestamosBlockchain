//proveedoresService.js
import ProveedoresRepository from '../repositories/proveedoresRepository.js';
import Web3 from 'web3';
import {CONTRATO_ABI, CONTRATO_DIRECCION, GANACHE_URL} from '..//config/blockchain_config.js';
import ProveedoresPDFService from './proveedoresPDFService.js';

//INICIALIZAR WEB3 Y EL CONTRATO CON GANACHE
const web3 = new Web3(GANACHE_URL);
const contrato = new web3.eth.Contract(CONTRATO_ABI, CONTRATO_DIRECCION);

const ProveedoresService = { 
    getAll: async () => { 
        console.log('ProveedoresService: Obteniendo todos los proveedores'); 
        return await ProveedoresRepository.findAll(); 
    }, 
    create: async (data) => { 
        console.log('ProveedoresService: Creando nuevo proveedor :' + JSON.stringify(data)); 
        return await ProveedoresRepository.insert(data); 
    },

    getById: async(id)=> { 
        console.log('ProveedoresService: Obteniendo factura por id:' + id); 
        return await ProveedoresRepository.findById(id); 
    },

    update: async (id, data) => { 
        console.log('ProveedoresService: Actualizando proveedor con id ' + id + ' con datos: ' + JSON.stringify(data)); 
        return await ProveedoresRepository.update(id, data); 
    },

    delete: async (id) => { 
        console.log('ProveedoresService: Eliminando proveedor con id ' + id); 
        return await ProveedoresRepository.delete(id); 
    },

    updateTxHash: async(id, txHash) =>{
        console.log('ProveedoresService: Actualizando proveedor con id: ' + id + 'con hash' + txHash);
        return await ProveedoresRepository.updateTxHash(id, txHash);
    },

    validarBlockchain: async (id) =>{
        console.log('ProveedoresService: Validando proveedor con el id: ' + id + 'en blockchain');
        try{
            //OBTENER LA FACTURA DE LA BASE DE DATOS
            const proveedorDB = await ProveedoresRepository.findById(id);

            //OBTENER PROVEEDOR DEL BLOCKCHAIN CON EL METODO GET
            const proveedorBlockchain = await contrato.methods.getProveedores(id).call();

            //COMPARA DATOS
            const idCoincide = proveedorDB.id.toString() === proveedorBlockchain.id.toString();
            const cuentaCoincide = proveedorDB.cuenta === proveedorBlockchain.cuenta;
            const correoCoincide = proveedorDB.correo === proveedorBlockchain.correo;
            const tieneHash = proveedorDB.tx_hash_block !== null;  // SI TIENE HASH O ESTÁ VACIO

            return{
                valid: idCoincide && cuentaCoincide && correoCoincide && tieneHash, //VAIDA 
                idCoincide,
                cuentaCoincide,
                correoCoincide,
                tieneHash,
                datosDB:{
                    id: proveedorDB.id,
                    cuenta: proveedorDB.cuenta,
                    correo: proveedorDB.correo,
                    txHash: proveedorDB.tx_hash_block,
                },
                datosBlockchain: {
                    id: proveedorBlockchain.id.toString(),
                    cuenta: proveedorBlockchain.cuenta,
                    correo: proveedorBlockchain.correo,
                }
            };

        }catch (error) {
            console.error('Error al validar proveedores en blockchain: ', error);
            throw new Error('Error al validar proveedores en blockchain: ' + error.message);
        }
    },

    generarPDF: async (id) => {
        console.log('ProveedoresService: Generando PDF para proveedor con id ' + id);
        try {
            const proveedor = await ProveedoresRepository.findById(id);
            if (!proveedor) {
                throw new Error('Proveedor no encontrada');
            }
            const proveedoresPDFService = new ProveedoresPDFService();
            const result = await proveedoresPDFService.generarProveedorePDF(proveedor);
            return result;
        } catch (error) {
            console.error('Error al generar PDF:', error);
            throw new Error('Error al generar PDF: ' + error.message);
        }
    }

}

export default ProveedoresService;