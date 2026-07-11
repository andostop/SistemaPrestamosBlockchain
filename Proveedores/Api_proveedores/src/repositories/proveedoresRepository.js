import connection from '../config/database.js';

const ProveedoresRepository = { 
    findAll: async () => { 
        console.log('ProveedoresRepository - Obteniendo todos los proveedores'); 
        const [results] = await connection.promise().query('SELECT * FROM proveedores'); 
        return results; 
    }, 
    insert: async (data) => { 
        console.log('ProveedoresRepository - Insertando proveedores:' + JSON.stringify(data)); 
        const {codigo, ruc, contacto, telefono, correo, banco, cuenta} = data; 
        const [result] = await connection.promise().query(
            'INSERT INTO proveedores (codigo, ruc, contacto, telefono, correo, banco, cuenta) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [codigo, ruc, contacto, telefono, correo, banco, cuenta]
        );
        return { id: result.insertId, codigo, ruc, contacto, telefono, correo, banco, cuenta}; 
    },

    findById: async (id) => { 
        console.log('ProveedoresRepository - Obteniendo proveedores por ID: ' + id); 
        const [results] = await connection.promise().query( 
            'SELECT * FROM proveedores WHERE id = ?', [id] 
        ); 
        return results[0]; 
    }, 

    update: async (id, data) => { 
        console.log('FacturaRepository - Actualizando factura ID: ' + id + ' con datos: ' + JSON.stringify(data)); 
        const {codigo, ruc, contacto, telefono, correo, banco, cuenta} = data; 
        await connection.promise().query( 
            'UPDATE proveedores SET codigo = ?, ruc = ?, contacto = ?, telefono = ?, correo = ?, banco = ?, cuenta = ? WHERE id = ?', 
            [codigo, ruc, contacto, telefono, correo, banco, cuenta, id] 
        ); 
        return { id, codigo, ruc, contacto, telefono, correo, banco, cuenta }; 
    },

    delete: async (id) => { 
        console.log('ProveedoresRepository - Eliminando proveedor ID: ' + id); 
        await connection.promise().query( 
            'DELETE FROM proveedores WHERE id = ?', [id] 
        ); 
    },

    updateTxHash: async (id, txHash) => { 
        console.log('ProveedoresRepository - Actualizando proveedor ID: ' + id + ' con hash: ' + txHash); 
        await connection.promise().query( 
            'UPDATE proveedores SET tx_hash_block = ?, estado = ? WHERE id = ?', 
            [txHash, 'Enviado', id] 
        ); 
    },

    updateIpfsHash: async (id, ipfsHash) => {
        console.log('ProveedoresRepository - Actualizando proveedor ID: ' + id + ' con IPFS hash: ' + ipfsHash);
        await connection.promise().query(
            'UPDATE proveedores SET ipfs_hash = ? WHERE id = ?',
            [ipfsHash, id]
        );
    }
}; 

export default ProveedoresRepository;