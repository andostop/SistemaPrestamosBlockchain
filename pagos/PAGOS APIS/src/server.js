import express from 'express';
import pagoRoutes from './routes/pagoRoutes.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());

// Middleware para habilitar CORS
app.use(cors({
    origin: '*', // Permitir solicitudes desde cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/pagos', pagoRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});