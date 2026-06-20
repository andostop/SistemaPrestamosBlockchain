const Web3 = window.Web3;

let cuentaBlockchain = null;

let CONTRATO_ABI = null;

let CONTRATO_DIRECCION = null;


window.addEventListener(
    'load',
    async () => {
        await conectarMetaMask();
        buscarPrestamos();
        await cargarConfiguracionContrato();
    }
);

async function buscarPrestamos() {
    try {

        Swal.fire({
            title: 'Cargando préstamos',
            didOpen: () => Swal.showLoading()
        });

        const response = await axios.get('http://localhost:3000/prestamos');
        Swal.close();
        const prestamos = response.data;
        const tbody = document.getElementById('prestamosBody');

        tbody.innerHTML = '';

        prestamos.forEach(prestamo => {

            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${prestamo.id}</td>
                <td>${prestamo.cliente_id}</td>
                <td>${prestamo.monto}</td>
                <td>${prestamo.plazo}</td>
                <td>${prestamo.interes}</td>
                <td>${prestamo.estado}</td>

                <td>
                    <button
                        class="btn btn-sm btn-outline-info"
                        onclick="editarPrestamo('${prestamo.id}')"
                    >
                        EDITAR
                    </button>

                    <button
                        class="btn btn-sm btn-outline-danger"
                        onclick="enviarBlockchain('${prestamo.id}')"
                    >
                        ENVIAR A BLOCKCHAIN
                    </button>

                    <button
                        class="btn btn-sm btn-outline-secondary"
                        onclick="validarBlockchain('${prestamo.id}')"
                    >
                        VALIDAR
                    </button>
                </td>
            `;

            tbody.appendChild(row);
        });

    } catch (error) {
        console.error('Error al cargar los prestamos:', error);
        Swal.fire('Error', 'No se pudieron cargar los préstamos', 'error');
    }
}

function agregarPrestamo() {
    window.location.href = "prestamo-form.html";
}

function editarPrestamo(id) {
    window.location.href = "prestamo-form.html?id=" + id;
}

async function conectarMetaMask() {
    console.log('Intentando conectar MetaMask...');
    if (!window.ethereum) {
        alert('MetaMask no está instalado. Por favor, instálalo para usar esta aplicación.');
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
        console.error('Error al conectar MetaMask:', error);
    }
}

async function enviarBlockchain(id) {
    if (!cuentaBlockchain) {
        Swal.fire('Error', 'Primero debes conectar Metamask', 'error');
        return;
    }
    try {
        Swal.fire({ title: 'Enviando a blockchain', didOpen: () => { Swal.showLoading() } });
        const response = await axios.get('http://localhost:3000/prestamos/' + id);
        const prestamo = response.data;

        // Configuracion de web3 con Metamask
        const web3 = new Web3(window.ethereum);

        // Crear instancia del contrato
        const contrato = new web3.eth.Contract(CONTRATO_ABI, CONTRATO_DIRECCION);

        // Enviar transaccion al contrato
        const tx = await contrato.methods.createPrestamo(prestamo.id, prestamo.cliente_id, parseInt(prestamo.monto), prestamo.plazo, parseInt(prestamo.interes), prestamo.estado.toString())
                    .send({ from: cuentaBlockchain });

        console.log('Transacción enviada:', tx.transactionHash);

        // Guardar el hash de la transacción en el backend
        await axios.put('http://localhost:3000/prestamos/' + id + '/tx-hash',
            { txHash: tx.transactionHash }
        );

        Swal.close();
        Swal.fire('Éxito', 'Prestamo enviado a blockchain con hash: ' + tx.transactionHash, 'success');

    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

async function cargarConfiguracionContrato() {
    try {
        const response = await axios.get('http://localhost:3000/prestamos/contract/config');
        CONTRATO_ABI = response.data.abi;
        CONTRATO_DIRECCION = response.data.address;
        console.log('Configuración del contrato cargada:', CONTRATO_DIRECCION);
    } catch (error) {
        console.error('Error al cargar la configuración del contrato:', error);
        Swal.fire('Error', 'No se pudo cargar la configuración del contrato.', 'error');
    }
}

async function validarBlockchain(id) {
    try {
        Swal.fire({ 
                    title: 'Validando en blockchain',
                    didOpen: () => { Swal.showLoading() } 
                });
        
        // LLamar al endpoint para validar la factura en blockchain
        const response = await axios.get(
                            'http://localhost:3000/prestamos/' + id + '/validar'
                        );
        
        const resultado = response.data;

        Swal.close();

        if (resultado.valid) {
            Swal.fire({
                icon : 'success',
                title: 'Prestamo válida en blockchain',
                html: `
                    <strong>Datos Blockchain:</strong><br>
                    ID: ${resultado.datosBlockchain.id}<br>
                    Cliente ID: ${resultado.datosBlockchain.cliente_id}<br>
                    Monto: ${resultado.datosBlockchain.monto}<br>
                    Plazo: ${resultado.datosBlockchain.plazo}<br>
                    Interés: ${resultado.datosBlockchain.interes}<br>
                    Estado: ${resultado.datosBlockchain.estado}<br>

                    <strong>Datos de Base de Datos:</strong><br>
                    ID: ${resultado.datosDB.id}<br>
                    Cliente ID: ${resultado.datosDB.cliente_id}<br>
                    Monto: ${resultado.datosDB.monto}<br>
                    Plazo: ${resultado.datosDB.plazo}<br>
                    Interés: ${resultado.datosDB.interes}<br>
                    Estado: ${resultado.datosDB.estado}<br>
                    Hash: ${resultado.datosDB.tx_hash_block}<br>
                `
            });
        }  else {
            Swal.fire({
                icon : 'error',
                title: 'Prestamo NO válida en blockchain',
                html: `
                    <strong>Datos Blockchain:</strong><br>
                    ID: ${resultado.datosBlockchain.id}<br>
                    Cliente ID: ${resultado.datosBlockchain.cliente_id}<br>
                    Monto: ${resultado.datosBlockchain.monto}<br>
                    Plazo: ${resultado.datosBlockchain.plazo}<br>
                    Interés: ${resultado.datosBlockchain.interes}<br>
                    Estado: ${resultado.datosBlockchain.estado}<br>

                    <strong>Datos de Base de Datos:</strong><br>
                    ID: ${resultado.datosDB.id}<br>
                    Cliente ID: ${resultado.datosDB.cliente_id}<br>
                    Monto: ${resultado.datosDB.monto}<br>
                    Plazo: ${resultado.datosDB.plazo}<br>
                    Interés: ${resultado.datosDB.interes}<br>
                    Estado: ${resultado.datosDB.estado}<br>
                    Hash: ${resultado.datosDB.tx_hash_block}<br>
                `
            });
        }                

        const validacion = response.data;

    } catch (error) {
        console.error('Error al validar en blockchain:', error);
        Swal.close();
        Swal.fire('Error', error.message, 'error');
    }
}