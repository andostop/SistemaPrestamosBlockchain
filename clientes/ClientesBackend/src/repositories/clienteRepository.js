import connection from '../config/database.js';

const ClienteRepository = {



// Buscar a todo
    findAll: async () => {
        console.log('ClienteRepository - Obteniendo todos los clientes');
        const [results] = await connection.promise().query('SELECT * FROM clientes');
        return results;
    },


//Insertar un cliente
    insert: async (data) => {
        console.log('ClienteRepository - Insertando cliente: ' + JSON.stringify(data));

        const { nombre, dni, telefono, direccion, correo, activo } = data;

        const [result] = await connection.promise().query(
            'INSERT INTO clientes (nombre, dni, telefono, direccion, correo, activo) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, dni, telefono, direccion, correo, activo]
        );
        return {
            id: result.insertId,
            nombre,
            dni,
            telefono,
            direccion,
            correo,
            activo
        };
    },


//Encontrar cliente por ID
    findById: async (id) => {
    console.log('ClienteRepository - Obteniendo cliente por ID: ' + id);

        const [results] = await connection
            .promise()
            .query('SELECT * FROM clientes WHERE id = ?', [id]);

        return results[0];
    },

    update: async (id, data) => {
    console.log(
        'ClienteRepository - Actualizando cliente ID: ' +
        id +
        ' con datos: ' +
        JSON.stringify(data)
    );

    const { nombre, dni, telefono, direccion, correo, activo } = data;

    await connection.promise().query(
        `UPDATE clientes
         SET nombre = ?,
             dni = ?,
             telefono = ?,
             direccion = ?,
             correo = ?,
             activo = ?
         WHERE id = ?`,
        [nombre, dni, telefono, direccion, correo, activo, id]
    );

        return {
            id,
            nombre,
            dni,
            telefono,
            direccion,
            correo,
            activo
        };
    },

    
//Borrar un cliente
    delete: async (id) => {
        console.log('ClienteRepository - Eliminando cliente ID: ' + id);
        await connection
            .promise()
            .query('DELETE FROM clientes WHERE id = ?', [id]
        );
    },

    updateTxHash: async (id, txHash) => {
        console.log('ClienteRepository - Actualizando cliente ID: ' + id + ' con hash: ' + txHash);
        await connection.promise().query(
            'UPDATE clientes SET tx_hash_block = ?, estado = ? WHERE id = ?',
            [txHash, 'ENVIADA', id]
        );
    },

    updateIpfsHash: async (id, ipfsHash) => {
        console.log('ClienteRepository - Actualizando cliente ID: ' + id + ' con hash de IPFS: ' + ipfsHash);
        await connection.promise().query(
            'UPDATE clientes SET ipfs_hash = ? WHERE id = ?',
            [ipfsHash, id]  
        );
    }

};

export default ClienteRepository;