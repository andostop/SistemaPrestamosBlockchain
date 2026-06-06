import express from "express";

import {
    obtenerPrestamos,
    crearPrestamo,
    obtenerPrestamo,
    actualizarPrestamo,
    eliminarPrestamo
}
from "../controllers/prestamoController.js";

const router = express.Router();

router.get("/", obtenerPrestamos);

router.post("/", crearPrestamo);

router.get("/:id", obtenerPrestamo);

router.put("/:id", actualizarPrestamo);

router.delete("/:id", eliminarPrestamo);

export default router;