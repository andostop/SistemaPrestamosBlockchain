const Web3 = window.Web3
let cuentaBlockchain = null;

let CONTRATO_ABI = null;
let CONTRATO_DIRECCION = null;

let NFT_ABI = null;
let NFT_DIRECCION = null;

window.addEventListener('load',
    async () => {
        await conectarMetaMask();
        buscarPagos();
        await cargarConfiguracionContrato();
        await cargarConfiguracionNFT();
    }
);

async function buscarPagos() {
    try {
        Swal.fire({ title: 'Cargando pagos', didOpen: () => { Swal.showLoading(); } });
        const response = await axios.get('http://localhost:3000/pagos');

        Swal.close();

        const pagos = response.data;
        const tbody = document.getElementById('pagosBody');
        tbody.innerHTML = '';
        pagos.forEach(pago => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${pago.id}</td>
                <td>${pago.cliente_id}</td>
                <td>${pago.prestamo_id}</td>
                <td>${pago.monto_pagado}</td>
                <td>${pago.saldo_restante}</td>
                <td>${pago.fecha}</td>
                <td>${pago.metodo_pago}</td>
                <td>${pago.estado}</td>
                <td>
                    <button class="btn btn-sm btn-outline-info" onclick="editarPago('${pago.id}')">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="enviarBlockchain('${pago.id}')">Enviar a Blockchain</button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="validarBlockchain('${pago.id}')">Validar</button>
                    <button class="btn btn-sm btn-outline-primary" onclick="mintNFT('${pago.id}')">Mint NFT</button>
                    <button class="btn btn-sm btn-outline-success" onclick="verificarNFT('${pago.id}')">Verificar NFT</button>
                    <button class="btn btn-sm btn-outline-warning" onclick="generarPDF('${pago.id}')">Generar PDF</button>
                </td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {

        console.error(
            'Error al cargar los pagos:',
            error
        );

        Swal.fire(
            'Error',
            'No se pudieron cargar los pagos.',
            'error'
        );
    }
}

function agregarPago() {
    window.location.href = "pagos-form.html";
}

function editarPago(id) {
    window.location.href = `/pagos-form?id=${id}`;
}

async function conectarMetaMask() {
    if (!window.ethereum) {
        Swal.fire('Error', 'MetaMask no está instalado. Por favor, instálalo para continuar.', 'error');
        return;
    }
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        cuentaBlockchain = accounts[0];
        document.getElementById('cuentaConectada').textContent = cuentaBlockchain;

        window.ethereum.on('accountsChanged', (accounts) => {
            cuentaBlockchain = accounts[0];
            document.getElementById('cuentaConectada').textContent = cuentaBlockchain;
        });

    } catch (error) {
        console.error('Error al conectar MetaMask:', error)
    }
}

async function enviarBlockchain(id) {
    if (!cuentaBlockchain) {
        Swal.fire('Error', 'Primero debes conectar Metamask', 'error');
        return;
    }
    try {
        Swal.fire({ title: 'Enviando a blockchain', didOpen: () => { Swal.showLoading() } });
        const response = await axios.get('http://localhost:3000/pagos/' + id);
        const pago = response.data;

        // Configuracion de web3 con Metamask
        const web3 = new Web3(window.ethereum);
        // Crear instancia del contrato
        const contrato = new web3.eth.Contract(CONTRATO_ABI, CONTRATO_DIRECCION);
        // Generar timestamp actual en segundos
        const timestamp = Math.floor(Date.now() / 1000);
        // Enviar transacción al contrato
        const tx = await contrato.methods.createPago(
            Number(pago.id),
            Number(pago.cliente_id),
            Math.floor(Number(pago.monto_pagado) * 100),
            timestamp
        ).send({
            from: cuentaBlockchain
        });

        console.log('Transacción enviada:', tx.transactionHash);

        // Guardar el hash de la transacción en el backend
        await axios.put('http://localhost:3000/pagos/' + id + '/txHash',
            { txHash: tx.transactionHash }
        );

        Swal.close();
        Swal.fire('Éxito', 'Pago enviado a Blockchain con hash: ' + tx.transactionHash, 'success');

    } catch (error) {
        console.error('Error al enviar a Blockchain:', error);
        Swal.fire('Error', 'No se pudo enviar el pago a Blockchain.', 'error');
    }
}

async function cargarConfiguracionContrato() {
    try {
        const response = await axios.get('http://localhost:3000/pagos/contract/config');
        CONTRATO_ABI = response.data.abi;
        CONTRATO_DIRECCION = response.data.address;
        console.log('Configuración del contrato cargado:', CONTRATO_DIRECCION);
    } catch (error) {
        console.error('Error al cargar la configuración del contrato:', error);
        Swal.fire('Error', 'No se pudo cargar la configuración del contrato', error)
    }

}

async function validarBlockchain(id) {
    try {
        Swal.fire({
            title: 'Validando pago en blockchain',
            didOpen: () => {
                Swal.showLoading();
            }
        });
        // Llamar al endpoint para validar el pago en blockchain
        const response = await axios.get(
            'http://localhost:3000/pagos/' + id + '/validar'
        );
        const resultado = response.data;
        Swal.close();
        if (resultado.valid) {
            Swal.fire({
                icon: 'success',
                title: 'Pago válido en blockchain',
                html: `
                    <strong>Datos Blockchain:</strong><br>
                    ID: ${resultado.datosBlockchain.id}<br>
                    Cliente: ${resultado.datosBlockchain.cliente}<br>
                    Monto: ${resultado.datosBlockchain.monto}<br>

                    <br>
                    <strong>Datos Base de Datos:</strong><br>
                    ID: ${resultado.datosDB.id}<br>
                    Cliente: ${resultado.datosDB.cliente}<br>
                    Monto: ${resultado.datosDB.monto}<br>
                    Hash: ${resultado.datosDB.txHash}<br>
                `
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Pago NO válido en blockchain',
                html: `
                    <strong>Datos Blockchain:</strong><br>
                    ID: ${resultado.datosBlockchain.id}<br>
                    Cliente: ${resultado.datosBlockchain.cliente}<br>
                    Monto: ${resultado.datosBlockchain.monto}<br>

                    <br>
                    <strong>Datos Base de Datos:</strong><br>
                    ID: ${resultado.datosDB.id}<br>
                    Cliente: ${resultado.datosDB.cliente}<br>
                    Monto: ${resultado.datosDB.monto}<br>
                    Hash: ${resultado.datosDB.txHash}<br>
                `
            });
        }
    } catch (error) {
        console.error(
            'Error al validar pago en blockchain:',
            error
        );
        Swal.close();

        Swal.fire(
            'Error',
            error.message,
            'error'
        );
    }
}

async function cargarConfiguracionNFT() {
    try {
        const response = await axios.get('http://localhost:3000/pagos/nft/config');
        NFT_ABI = response.data.abi;
        NFT_DIRECCION = response.data.address;
        console.log('Configuración del NFT cargado:', NFT_DIRECCION);
    } catch (error) {
        console.error('Error al cargar la configuración del NFT:', error);
        Swal.fire('Error', 'No se pudo cargar la configuración del NFT', error)
    }
}

async function mintNFT(id) {
    if (!cuentaBlockchain) {
        Swal.fire('Error', 'Primero debes conectar Metamask', 'error');
        return;
    }
    if (!NFT_ABI || !NFT_DIRECCION) {
        Swal.fire('Error', 'La configuración del contrato NFT no está cargada.', 'error');
        return;
    }
    try {
        Swal.fire({ title: 'Minteando NFT', didOpen: () => { Swal.showLoading() } });
        const response = await axios.get('http://localhost:3000/pagos/' + id);
        const pago = response.data;

        // Configuracion de web3 con Metamask
        const web3 = new Web3(window.ethereum);

        // Crear instancia del contrato NFT
        const contratoNFT = new web3.eth.Contract(NFT_ABI, NFT_DIRECCION);

        const monto = Math.floor(Number(pago.monto_pagado) * 100);

        // Generar hash de la factura
        const hash = web3.utils.soliditySha3(
            { t: 'uint', v: pago.id },
            { t: 'uint', v: pago.cliente_id },
            { t: 'uint', v: monto }
        );

        // Enviar transaccion al contrato NFT
        const tx = await contratoNFT.methods.mintPagoNFT(
            pago.id,
            pago.cliente_id,
            monto,
            hash,
            cuentaBlockchain // La direccion que recibira el NFT
        ).send({ from: cuentaBlockchain });

        console.log('NFT minteado con exito:', tx.transactionHash);

        Swal.close();
        Swal.fire('Éxito', 'NFT minteado con hash de transacción: ' + tx.transactionHash, 'success');


    } catch (error) {
        console.error('Error al mintear el NFT:', error);
        Swal.close();
        Swal.fire('Error', error.message, 'error');

    }
}

async function verificarNFT(id) {
    try {
        Swal.fire({
            title: 'Verificando NFT',
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await axios.get(
            `http://localhost:3000/pagos/nft/verify-complete/${id}/${cuentaBlockchain}`
        );

        const result = response.data;
        Swal.close();

        if (result.hasNFT) {
            Swal.fire({
                icon: result.ownership.isOwner ? 'success' : 'warning',
                title: result.ownership.isOwner
                    ? 'NFT encontrado (Te pertenece)'
                    : 'NFT encontrado (No te pertenece)',
                html: `
                    <strong>Token ID:</strong> ${result.tokenId}<br>
                    <strong>Pago ID:</strong> ${result.metadata.pagoId}<br>
                    <strong>Cliente ID:</strong> ${result.metadata.clienteId}<br>
                    <strong>Monto Pagado:</strong> ${result.metadata.montoPagado}<br>
                    <strong>Hash:</strong> ${result.metadata.hash}<br>
                    <strong>Fecha:</strong> ${new Date(result.metadata.timestamp * 1000).toLocaleString()}<br><br>

                    <strong>Propietario:</strong> ${result.ownership.owner}<br>
                    <strong>Tu Cuenta:</strong> ${cuentaBlockchain}<br>
                    <strong>Te pertenece:</strong> ${result.ownership.isOwner ? 'Sí' : 'No'}<br>
                `
            });
        } else {
            Swal.fire(
                'Información',
                'No se encontró un NFT para este pago.',
                'info'
            );
        }

    } catch (error) {
        console.error('Error al verificar el NFT:', error);
        Swal.close();
        Swal.fire('Error', error.message, 'error');
    }
}

async function generarPDF(id) {
    try {
        Swal.fire({ title: 'Generando PDF y SUBIENDO a IPFS', didOpen: () => { Swal.showLoading() } });
        const response = await axios.get(`http://localhost:3000/pagos/${id}/pdf`);
        const result = response.data;
        Swal.close();
        if (result.ipfsHash) {
            Swal.fire({
                icon: 'success',
                title: 'PDF generado y subido a IPFS',
                html:
                    'IPFS Hash: ' + result.ipfsHash + '<br>' +
                    'URL: <a href="' + result.ipfsUrl + '" target="_blank">' + result.ipfsUrl + '</a>'
            });
        } else {
            Swal.fire('Error', 'No se pudo generar el PDF', 'error');
        }

    } catch (error) {
        console.error('Error al generar el PDF:', error);
        Swal.close();
        Swal.fire('Error', error.message, 'error');
    }
}