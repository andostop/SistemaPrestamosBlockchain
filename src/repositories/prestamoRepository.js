import connection from '../config/database.js';

const PrestamoRepository = {

    findAll: async () => {

        const [results] =
        await connection.promise().query(
            'SELECT * FROM prestamos'
        );

        return results;
    },

    insert: async (data) => {

        const {
            clienteId,
            monto,
            plazo,
            interes,
            estado
        } = data;

        const [result] =
        await connection.promise().query(
            `INSERT INTO prestamos
            (cliente_id,monto,plazo,interes,estado)
            VALUES (?,?,?,?,?)`,
            [
                clienteId,
                monto,
                plazo,
                interes,
                estado
            ]
        );

        return {
            id: result.insertId,
            ...data
        };
    },

    findById: async (id) => {

        const [results] =
        await connection.promise().query(
            'SELECT * FROM prestamos WHERE id=?',
            [id]
        );

        return results[0];
    },

    update: async (id,data) => {

        const {
            clienteId,
            monto,
            plazo,
            interes,
            estado
        } = data;

        await connection.promise().query(
            `UPDATE prestamos
            SET cliente_id=?,
                monto=?,
                plazo=?,
                interes=?,
                estado=?
            WHERE id=?`,
            [
                clienteId,
                monto,
                plazo,
                interes,
                estado,
                id
            ]
        );

        return { id, ...data };
    },

    delete: async (id) => {

        await connection.promise().query(
            'DELETE FROM prestamos WHERE id=?',
            [id]
        );

    }

};

export default PrestamoRepository;