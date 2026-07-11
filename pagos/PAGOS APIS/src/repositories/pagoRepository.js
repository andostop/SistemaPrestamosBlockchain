import connection from '../config/database.js';

const PagoRepository = {

    findAll: async () => {
        console.log('PagoRepository - Obteniendo todos los pagos');
        const [results] = await connection.promise().query('SELECT * FROM pagos');
        return results;
    },

    insert: async (data) => {
        console.log('PagoRepository - Insertando pago: ' + JSON.stringify(data));
        const {
            clienteId,
            prestamoId,
            montoPagado,
            saldoRestante,
            fecha,
            metodoPago
        } = data;
        const [result] = await connection.promise().query(
            `INSERT INTO pagos
            (cliente_id, prestamo_id, monto_pagado, 
            saldo_restante, fecha, metodo_pago) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                clienteId,
                prestamoId,
                montoPagado,
                saldoRestante,
                fecha,
                metodoPago
            ]
        );
        return {
            id: result.insertId,
            clienteId,
            prestamoId,
            montoPagado,
            saldoRestante,
            fecha,
            metodoPago
        };
    },

    findById: async (id) => {
        console.log('PagoRepository - Obteniendo pago por ID: ' + id);
        const [results] = await connection.promise().query('SELECT * FROM pagos WHERE id = ?', [id]);
        return results[0];
    },

    update: async (id, data) => {
        console.log('PagoRepository - Actualizando pago ID: ' + id + ' con datos: ' + JSON.stringify(data));
        const {
            clienteId,
            prestamoId,
            montoPagado,
            saldoRestante,
            fecha,
            metodoPago
        } = data;
        await connection.promise().query(
            `UPDATE pagos
             SET cliente_id = ?,
                 prestamo_id = ?,
                 monto_pagado = ?,
                 saldo_restante = ?,
                 fecha = ?,
                 metodo_pago = ?
             WHERE id = ?`,
            [
                clienteId,
                prestamoId,
                montoPagado,
                saldoRestante,
                fecha,
                metodoPago,
                id
            ]
        );
        return {
            id,
            clienteId,
            prestamoId,
            montoPagado,
            saldoRestante,
            fecha,
            metodoPago
        };
    },

    delete: async (id) => {
    console.log('PagoRepository - Eliminando pago ID: ' + id);
    const [result] = await connection.promise().query('DELETE FROM pagos WHERE id = ?',[id]);
    return result;
},

updateTxHash: async (id, txHash) => {
    console.log('PagoRepository - Actualizando pago ID: ' + id + ' con hash: ' + txHash);
    await connection.promise().query(
        'UPDATE pagos SET tx_hash_block = ?, estado = ? WHERE id = ?',
        [txHash, 'ENVIADA', id]
    );
},

updateIpfsHash: async (id, ipfsHash) => {
    console.log('PagoRepository - Actualizando pago ID: ' + id + ' con hash de IPFS: ' + ipfsHash);
    await connection.promise().query(
        'UPDATE pagos SET ipfs_hash = ? WHERE id = ?',
        [ipfsHash, id]
    );
}
};

export default PagoRepository;