import express from "express";
import clienteRoutes from "./routes/clienteRoutes.js";
import cors from 'cors';

const app = express();
const port = 3000;



// Middleware para habilitar CORS
app.use(cors({
  origin: '*', // Permitir solicitudes desde cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permitir métodos HTTP específicos
  allowedHeaders: ['Content-Type', 'Authorization'] // Permitir encabezados específicos
}));

app.use(express.json());

app.use('/api/clientes', clienteRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});