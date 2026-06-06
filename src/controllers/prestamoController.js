import PrestamoRepository from '../repositories/prestamoRepository.js';

// GET TODOS
export const obtenerPrestamos = async (req, res) => {
    try {

        const prestamos =
        await PrestamoRepository.findAll();

        res.json(prestamos);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
// POST
export const crearPrestamo = async (req, res) => {
    try {

        const prestamo =
        await PrestamoRepository.insert(req.body);

        res.status(201).json(prestamo);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// GET POR ID
export const obtenerPrestamo = async (req, res) => {
    try {

        const prestamo =
        await PrestamoRepository.findById(req.params.id);

        if (!prestamo) {
            return res.status(404).json({
                mensaje: "Préstamo no encontrado"
            });
        }

        res.json(prestamo);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// PUT
export const actualizarPrestamo = async (req, res) => {
    try {

        const prestamo =
        await PrestamoRepository.update(
            req.params.id,
            req.body
        );

        res.json(prestamo);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
// DELETE
export const eliminarPrestamo = async (req, res) => {
    try {

        await PrestamoRepository.delete(req.params.id);

        res.json({
            mensaje: "Préstamo eliminado"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};