import PDFDocument from 'pdfkit';          
import fs from 'fs';                     
import path from 'path';                  
import { create } from 'kubo-rpc-client';  
import { IPFS_URL, IPFS_GATEWAY } from '../config/ipfs_config.js';
import ProveedoresRepository from '../repositories/proveedoresRepository.js';

class ProveedoresPDFService {


    // Genera el PDF de un proveedor 

    generarProveedorePDF(proveedores) {

        return new Promise((resolve, reject) => {

            try {

                // Obtener el hash de Blockchain
                const hashHex = proveedores.tx_hash_block || 'Pendiente de generar';
                const proveedoresId = proveedores.id || proveedores.codigo;

                // Crear la carpeta de PDFs si no existe
                const pdfDir = path.join(process.cwd(), 'pdfs');
                if (!fs.existsSync(pdfDir)) {
                    fs.mkdirSync(pdfDir, { recursive: true });
                }

                // Crear la ruta donde se guardará el PDF
                const filePath = path.join(
                    pdfDir,
                    `proveedor${proveedoresId}.pdf`
                );

                // Crear el archivo PDF
                const stream = fs.createWriteStream(filePath);

                // Inicializacion el documento PDF
                const doc = new PDFDocument();
                doc.pipe(stream);
                doc.fontSize(20).text('PROVEEDOR DIGITAL',{ align: 'center' }
                );

                doc.moveDown();
                doc.fontSize(14).text(`ID: ${proveedores.id}`);
                doc.text(`Ruc: ${proveedores.ruc}`);
                doc.text(`Contacto: ${proveedores.contacto}`);
                doc.text(`Telefono: ${proveedores.telefono}`);
                doc.text(`Banco: ${proveedores.banco}`);
                doc.text(`Cuenta: ${proveedores.cuenta}`);
                doc.text(`Estado: ${proveedores.estado}`);

                doc.moveDown();

                // Agregar el Hash de Blockchain al PDF
                doc.fontSize(7)
                    .fillColor('gray')
                    .text(
                        `Hash Blockchain: ${hashHex}`, //Firma
                        { align: 'left' }
                    );

                doc.end();

                stream.on('finish', async () => {

                    console.log(`PDF generado: ${filePath}`);

                    try {
                        const ipfs = create({ url: IPFS_URL });
                        const file = fs.readFileSync(filePath);

                        // Subir el PDF a IPFS
                        const result = await ipfs.add({
                            path: `proveedor${proveedoresId}.pdf`,
                            content: file
                        });

                        await ipfs.pin.add(result.cid);

                        // Obtener el Hash CID
                        const ipfsHash = result.cid.toString();
                        const ipfsUrl =`${IPFS_GATEWAY}/${ipfsHash}`;

                        // Ruta dentro de My Files (MFS)
                        const mfsPath =`/proveedor${proveedoresId}.pdf`;

                        // Eliminar una versión anterior si existe
                        try {
                            await ipfs.files.rm(mfsPath);
                        } catch (error) {
                        }

                        await ipfs.files.cp(`/ipfs/${ipfsHash}`,mfsPath);
                        console.log(`Archivo subido a IPFS: ${ipfsHash}`);
                        console.log(`Archivo visible en My Files: ${mfsPath}`);
                        console.log(`URL IPFS: ${ipfsUrl}`);

                        // Guardar el Hash IPFS en la Base de Datos
                        if (proveedores.id) {

                            await ProveedoresRepository.updateIpfsHash(
                                proveedores.id,
                                ipfsHash
                            );

                            console.log(
                                `IPFS hash guardado en BD para el proveedor ID: ${proveedores.id}`
                            );
                        }

                        // Retornar la información generada
                        resolve({
                            filePath,
                            ipfsHash,
                            ipfsUrl
                        });

                    } catch (ipfsError) {

                        console.error(
                            'Error al subir a IPFS:',
                            ipfsError
                        );

                        resolve({
                            filePath,
                            ipfsHash: null,
                            ipfsUrl: null
                        });
                    }
                });

                stream.on('error', reject);

            } catch (error) {

                reject(error);
            }
        });
    }
}

export default ProveedoresPDFService;