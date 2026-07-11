import express from 'express';
import proveedoresRoutes from './routes/proveedoresRoutes.js';
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware para habilitar CORS
app.use(cors(
    { 
        origin: '*', // Permitir solicitudes desde cualquier origen
        métodos: ['GET', 'POST', 'PUT', 'DELETE'], // Permitir métodos HTTP específicos
        permitidoHeaders: ['Content-Type', 'Authorization'] // Permitir encabezados específicos
    }
));




//Middleware para parsear JSON
app.use(express.json());

//Rutas de ejemplo
app.use('/api/proveedores', proveedoresRoutes);

app.listen(port,() =>{
    console.log(`Servidor corriendo en http://localhost:${port}`);
});