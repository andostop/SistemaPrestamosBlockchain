import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { IPFS_URL, IPFS_GATEWAY } from '../config/ipfs-config.js';
import { create } from 'kubo-rpc-client';
import PagoRepository from '../repositories/pagoRepository.js';

class PagoPDFService {
    generarPagoPDF(pago) {
        return new Promise((resolve, reject) => {
            try {
                const hashHex = pago.tx_hash_block || 'Pendiente de generar';
                const pagoId = pago.id;
                // Crear directorio si no existe
                const pdfDir = path.join(process.cwd(), 'pdfs');
                if (!fs.existsSync(pdfDir)) {
                    fs.mkdirSync(pdfDir, { recursive: true });
                }

                // Ruta del archivo PDF
                const filePath = path.join(pdfDir, `pago_${pagoId}.pdf`);
                const stream = fs.createWriteStream(filePath);

                // Crear el documento PDF
                const doc = new PDFDocument();
                doc.pipe(stream);

                // Agregar contenido al PDF
                // ===========================
// ENCABEZADO
// ===========================
doc
    .fontSize(22)
    .text('COMPROBANTE DE PAGO', {
        align: 'center'
    });

doc
    .fontSize(11)
    .text('Sistema de Gestión de Préstamos', {
        align: 'center'
    });

doc.moveDown(2);

// ===========================
// DATOS DEL PAGO
// ===========================
doc
    .fontSize(16)
    .text('Información del Pago');

doc.moveDown(0.5);

doc.fontSize(12);
doc.text(`ID del Pago: ${pagoId}`);
doc.text(`Cliente ID: ${pago.cliente_id}`);
doc.text(`Monto Pagado: S/ ${pago.monto_pagado}`);
doc.text(`Estado: ${pago.estado}`);

doc.moveDown();

// ===========================
// BLOCKCHAIN
// ===========================
doc
    .fontSize(16)
    .text('Información Blockchain');

doc.moveDown(0.5);

doc.fontSize(11);
doc.text(`Hash de Transacción:`);
doc.fontSize(9);
doc.text(hashHex);

doc.moveDown(2);

// ===========================
// PIE DE PÁGINA
// ===========================
doc
    .fontSize(10)
    .text(
        `Documento generado automáticamente el ${new Date().toLocaleString()}`,
        {
            align: 'center'
        }
    );

doc.end();

                stream.on('finish', async () => {
                    console.log(`PagoPDFService: PDF Generado en ${filePath}`);

                    // Subir a IPFS
                    try {
                        const ipfs = create({ url: IPFS_URL });
                        const file = fs.readFileSync(filePath);
                        const result = await ipfs.add(file);
                        const ipfsHash = result.cid.toString();
                        const ipfsUrl = `${IPFS_GATEWAY}/${ipfsHash}`;
                        console.log(`PagoPDFService: PDF subido a IPFS con hash ${ipfsHash}`);
                        console.log(`PagoPDFService: URL de IPFS: ${ipfsUrl}`);

                        // Guardar hash de IPFS en la Base de Datos
                        if (pago.id) {
                            await PagoRepository.updateIpfsHash(pago.id, ipfsHash);
                            console.log(`PagoPDFService: Hash de IPFS guardado en la base de datos para pago con ID ${pago.id}`);
                        }
                        resolve({ ipfsHash, ipfsUrl });
                    } catch (error) {
                        console.error('PagoPDFService: Error al subir PDF a IPFS:', error);
                        resolve({ ipfsHash: null, ipfsUrl: null });
                    }
                    stream.on('error', reject);
                });
            } catch (error) {
                console.error('PagoPDFService: Error al generar el PDF:', error);
                reject(error);
            }
        });
    }
}

export default PagoPDFService;