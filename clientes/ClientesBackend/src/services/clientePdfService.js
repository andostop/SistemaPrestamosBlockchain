import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { IPFS_URL, IPFS_GATEWAY } from '../config/ipfs-config.js';
import { create } from 'kubo-rpc-client';
import ClienteRepository from '../repositories/clienteRepository.js';

class ClientePdfService {
    generarClientePDF(cliente) {
        return new Promise((resolve, reject) => {
            try {
                const hashHex = cliente.tx_hash_block || 'Pendiente de generar';
                const clienteId = cliente.id || cliente.num_cliente;

                // Crear directorio si no existe
                const pdfDir = path.join(process.cwd(), 'pdfs');
                if (!fs.existsSync(pdfDir)) {
                    fs.mkdirSync(pdfDir, { recursive: true });
                }

                // Ruta del archivo PDF
                const filePath = path.join(pdfDir, `cliente_${clienteId}.pdf`);
                const stream = fs.createWriteStream(filePath);

                //Crear el documento PDF
                const doc = new PDFDocument();
                doc.pipe(stream);

                // Agregar contenido al PDF
                // ===============================
// ESTILO DEL PDF
// ===============================

const COLOR = '#2E7D32'; // Verde oscuro

// Fondo del encabezado
doc.rect(0, 0, doc.page.width, 90)
    .fill(COLOR);

// Título
doc
    .fillColor('white')
    .fontSize(24)
    .font('Helvetica-Bold')
    .text('CLIENTE DIGITAL', 0, 30, {
        align: 'center'
    });

// Volver al color negro
doc.fillColor('black');

// Línea decorativa
doc.moveTo(50, 105)
    .lineTo(545, 105)
    .lineWidth(2)
    .strokeColor(COLOR)
    .stroke();

// Espacio
doc.moveDown(3);

// Caja de información
doc.roundedRect(50, 130, 495, 170, 10)
    .lineWidth(1)
    .strokeColor('#CCCCCC')
    .stroke();

// Título de la sección
doc
    .fillColor(COLOR)
    .font('Helvetica-Bold')
    .fontSize(16)
    .text('Información del Cliente', 70, 145);

// Datos
doc
    .fillColor('black')
    .font('Helvetica')
    .fontSize(13);

doc.text(`ID de Cliente:`, 70, 180, { continued: true });
doc.font('Helvetica-Bold').text(` ${clienteId}`);

doc.font('Helvetica').text(`Nombre:`, 70, 205, { continued: true });
doc.font('Helvetica-Bold').text(` ${cliente.nombre}`);

doc.font('Helvetica').text(`DNI:`, 70, 230, { continued: true });
doc.font('Helvetica-Bold').text(` ${cliente.dni}`);

doc.font('Helvetica').text(`Estado:`, 70, 255, { continued: true });

doc.fillColor(cliente.estado === 'ACTIVO' ? 'green' : 'red')
    .font('Helvetica-Bold')
    .text(` ${cliente.estado}`);

// Volver al negro
doc.fillColor('black');

// Caja del hash
doc.roundedRect(50, 330, 495, 120, 10)
    .lineWidth(1)
    .strokeColor(COLOR)
    .stroke();

doc
    .fillColor(COLOR)
    .font('Helvetica-Bold')
    .fontSize(15)
    .text('Blockchain', 70, 345);

doc
    .fillColor('black')
    .font('Helvetica')
    .fontSize(11)
    .text('Hash de Transacción:', 70, 375);

doc
    .font('Courier')
    .fontSize(10)
    .fillColor('#444444')
    .text(hashHex, 70, 395, {
        width: 450
    });

                // Cerrar el documento PDF
                doc.end();

                stream.on('finish', async () => {
                    console.log(`ClientePdfService: PDF generado en ${filePath}`);

                    // Subir a IPFS
                    try {
                        const ipfs = create({ url: IPFS_URL });
                        const file = fs.readFileSync(filePath);
                        const result = await ipfs.add(file);
                        const ipfsHash = result.cid.toString();
                        const ipfsUrl = `${IPFS_GATEWAY}/${ipfsHash}`;

                        console.log(`ClientePdfService: PDF subido a IPFS con hash ${ipfsHash}`);
                        console.log(`ClientePdfService: URL de IPFS: ${ipfsUrl}`);

                        // Guardar hash de IPFS en la base de datos
                        if (cliente.id) {
                            await ClienteRepository.updateIpfsHash(cliente.id, ipfsHash);
                            console.log(`ClientePdfService: Hash de IPFS guardado en la base de datos para cliente con ID ${cliente.id}`);
                        }

                        resolve({ ipfsHash, ipfsUrl });
                    } catch (error) {
                        console.error('ClientePdfService: Error al subir PDF a IPFS:', error);
                        resolve({ ipfsHash: null, ipfsUrl: null });
                    }
                });

                stream.on('error', reject);

            } catch (error) {
                console.error('ClientePdfService: Error al generar el PDF:', error);
                reject(error);
            }
        });
    }
}

export default ClientePdfService;