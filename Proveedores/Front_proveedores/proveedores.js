const Web3= window.Web3;
let cuentaBlockchain = null; //Variable global

let CONTRATO_ABI = null;
let CONTRATO_DIRECCION = null; /* DIRECCCION DEL CONTRATO*/

let NFT_ABI = null;
let NFT_DIRECCION = null;/*DIRECCION DEL CONTRATO*/


window.addEventListener('load', async () => {
    await conectarMetaMask();
    await cargarConfiguracionContrato();
    await cargarConfiguracionNFT();
    await buscarProveedores();
});

async function buscarProveedores() { 
    try { 
        Swal.fire({ title: 'Cargando proveedores', didOpen: () => { Swal.showLoading() } });
        const response = await axios.get(' http://localhost:3000/api/proveedores' );
        Swal.close();

        const proveedores = response.data;
        const tbody = document.getElementById('proveedoresBody');
        tbody.innerHTML = ''; // Limpiar el contenido previo

        proveedores.forEach(proveedores => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${proveedores.id}</td>
                <td>${proveedores.codigo}</td>
                <td>${proveedores.ruc}</td>
                <td>${proveedores.contacto}</td>
                <td>${proveedores.telefono}</td>
                <td>${proveedores.correo}</td>
                <td>${proveedores.banco}</td>
                <td>${proveedores.cuenta}</td>
                <td>${new Date(proveedores.fecha).toLocaleDateString('es-PE')}</td>
                <td>${proveedores.estado}</td>
                <td class="acciones-columna">
                <div class="acciones-tabla">
                <button class="btn-accion btn-editar"title="Editar proveedor"onclick="editarProveedores('${proveedores.id}')"><i class="bi bi-pencil-square"></i>Editar</button>
                <button class="btn-accion btn-blockchain" title="Enviar proveedor a Blockchain" onclick="enviarBlockchain('${proveedores.id}')"> <i class="bi bi-box-arrow-up-right"></i> Blockchain </button>
                <button class="btn-accion btn-validar" title="Validar datos en Blockchain" onclick="validarBlockchain('${proveedores.id}')"> <i class="bi bi-shield-check"></i> Validar </button>
                <button class="btn-accion btn-mint" title="Crear NFT" onclick="mintNFT('${proveedores.id}')"> <i class="bi bi-gem"></i> Mint NFT </button>
                <button class="btn-accion btn-verificar" title="Verificar NFT" onclick="verificarNFT('${proveedores.id}')"> <i class="bi bi-patch-check"></i> Verificar </button>
                <button class="btn-accion btn-pdf" title="Generar PDF y subirlo a IPFS" onclick="generarPDF('${proveedores.id}')"> <i class="bi bi-file-earmark-pdf"></i> PDF </button>
                </div>
                </td>`;
        tbody.appendChild(row);
        });

    } catch (error) {
    console.error('Error al cargar a los proveedores:', error);
    Swal.fire('Error', 'No se pudieron cargar los proveedores.', 'error');
    }

}


function agregarProveedores(){
    window.location.href = "proveedores_form";
}

function editarProveedores(id) {
    window.location.href = 'proveedores_form?id=' + id;
}

async function conectarMetaMask() {
    console.log('Intentando conectar a MetaMask...');
    if (!window.ethereum) {
        Swal.fire('Error', 'MetaMask no está instalado. Por favor, instalar para continuar.', 'error');
        return;
    }
    try{
        const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
        cuentaBlockchain = accounts[0];
        document.getElementById('cuentaConectada').textContent = cuentaBlockchain;

        window.ethereum.on('accountsChanged', (accounts) => {
            cuentaBlockchain = accounts[0];
            document.getElementById('cuentaConectada').textContent = cuentaBlockchain;
        });

    } catch (error) {
        console.error('Error al conectar MetaMask', error);
    }
}

async function enviarBlockchain(id) {
    if(!cuentaBlockchain) {
        Swal.fire('Error', 'Primero debes de conectar Metamask', 'Error');
        return;
    }
    try{
        Swal.fire({ title: 'Enviando a Blockchain', didOpen: () => {Swal.showLoading()}});
        const response = await axios.get('http://localhost:3000/api/proveedores/' + id);
        const proveedores = response.data;

        if (!Array.isArray(CONTRATO_ABI) || CONTRATO_ABI.length === 0) {
    throw new Error(
        'El ABI del contrato no está cargado. Revisa el endpoint contract/config.'
    );
}

if (!CONTRATO_DIRECCION) {
    throw new Error(
        'La dirección del contrato no está cargada.'
    );
}



        //CONFIGURACION DE WEB3 CON METAMASK
        const web3 = new Web3(window.ethereum);

        //CREAR INSTANCIAS DEL CONTRATO
        const contrato = new web3.eth.Contract(CONTRATO_ABI, CONTRATO_DIRECCION); //Tenemos una instancia con Web3


        console.log(Object.keys(contrato.methods));


        //ENVIAR TRANSACCIÓN AL CONTRATO
        const tx = await contrato.methods.createValidacion(proveedores.id, proveedores.cuenta, proveedores.correo)
        .send({ from: cuentaBlockchain });

        console.log('Transaccion enviada: ', tx.transactionHash);

        //GUARDAR HASH DE LA TRANSACCION EN EL BACKEND
        await axios.put('http://localhost:3000/api/proveedores/' + id + '/tx-hash', {txHash: tx.transactionHash}
        );

        Swal.close();
        Swal.fire('Exito', 'Transaccion enviada al blockchain con hash: ' + tx.transactionHash, 'success');

        //RECARGAR 
        buscarProveedores();

    } catch (error){
        Swal.fire('Error', error.message, 'error');
    }
}

async function cargarConfiguracionContrato() {
    try {
        const response = await axios.get(
            'http://localhost:3000/api/proveedores/contract/config'
        );

        console.log('Respuesta completa del contrato:', response.data);
        console.log('ABI recibido:', response.data.abi);
        console.log('Cantidad de elementos ABI:',
            Array.isArray(response.data.abi)
                ? response.data.abi.length
                : 'No es un arreglo'
        );
        console.log('Dirección recibida:', response.data.address);

        CONTRATO_ABI = response.data.abi;
        CONTRATO_DIRECCION = response.data.address;

        if (!Array.isArray(CONTRATO_ABI) || CONTRATO_ABI.length === 0) {
            throw new Error(
                'El backend está enviando el ABI vacío o con un formato incorrecto.'
            );
        }

        console.log(
            'Configuración del contrato cargada correctamente:',
            CONTRATO_DIRECCION
        );

    } catch (error) {
        console.error(
            'Error al cargar la configuración del contrato:',
            error
        );

        Swal.fire(
            'Error',
            error.message || 'No se pudo cargar la configuración del contrato',
            'error'
        );
    }
}

async function validarBlockchain(id) {
    try{
        Swal.fire({title: 'Validando en blockchain', didOpen: () => { Swal.showLoading() }});
        
        //VALIDANDO FACTURA - ENDPOINT
        const response = await axios.get (
            'http://localhost:3000/api/proveedores/' + id + '/validar'
        );

        const resultado = response.data;
        
        Swal.close();

        if (resultado.valid) {
            Swal.fire({
                icon : 'success',
                title : 'Proveedor validado en blockchain',
                html:
                    `<strong>Datos de Blockchain</strong><br>
                    ID: ${resultado.datosBlockchain.id}<br>
                    Cuenta: ${resultado.datosBlockchain.cuenta}<br>
                    Correo: ${resultado.datosBlockchain.correo}<br>

                    <strong>Datos de base de datos</strong><br>
                    ID: ${resultado.datosDB.id}<br>
                    Cuenta: ${resultado.datosDB.cuenta}<br>
                    Correo: ${resultado.datosDB.correo}<br>
                    Hash: ${resultado.datosDB.txHash}<br>
                    `
                
            });
        } else { 
            Swal.fire ({
                icon : 'error',
                title: 'Factura NO válida en blockchain',
                html: 
                    `<strong>Datos Blockchain:</strong><br>
                    ID: ${ resultado.datosBlockchain.id }<br>
                    Cuenta: ${resultado.datosBlockchain.cuenta}<br>
                    Correo: ${resultado.datosBlockchain.correo}<br>

                    <strong>Datos de Base de Datos:</strong><br>
                    ID: ${ resultado.datosDB.id }<br>
                    Cuenta: ${resultado.datosDB.cuenta}<br>
                    Correo: ${resultado.datosDB.correo}<br>
                    Hash: ${resultado.datosDB.txHash}<br>`
            }); 
            
        }

        const validacion = response.data;

    }catch (error) {
        console.error('Error al validar el Blockchain: ', error);
        Swal.close();
        Swal.fire('Error', error.message, 'error');
    }
}

async function cargarConfiguracionNFT() {
    try{
        const response = await axios.get('http://localhost:3000/api/proveedores/nft/config');
        NFT_ABI = response.data.abi;
        NFT_DIRECCION =response.data.address;
        console.log('Configuracion del NFT cargadas: ', NFT_DIRECCION);
    }catch (error){
        console.error('Error al cargar la configuracion del NFT:', error);
        Swal.fire('Errror', 'No se puede cargar la configuracion del NFT.', 'error');
    }
}

async function mintNFT(id) {
    if(!cuentaBlockchain) {
        Swal.fire('Error', 'Primero debes conectar Metamask', 'error');
        return;
    }
    if(!NFT_ABI || !NFT_DIRECCION) {
        Swal.fire('Error', 'La configuracion del contrato NFT no está cargada.', 'error');
        return;
    }
    try{
        Swal.fire({tittle: 'Minteando NFT', didOpen: () => {Swal.showLoading()}});
        const response = await axios.get('http://localhost:3000/api/proveedores/'+ id);
        const proveedor = response.data;

        //CONFIGURACION DE WEB3 CON METAMASK
        const web3 = new Web3(window.ethereum);

        //CREAR INSTANCIAS DEL CONTRATO NFT
        const contratoNFT = new web3.eth.Contract(NFT_ABI, NFT_DIRECCION);

        //GENERAR HASH DE LA FACTURA 
        const hash = web3.utils.soliditySha3(
            {t: 'uint', v: proveedor.id},
            {t: 'string', v: proveedor.cuenta},
            {t: 'string', v: proveedor.correo},
        );

        //LIMAPIAR CONTRATO
        const tx = await contratoNFT.methods.mintProveedoresNFT(
            proveedor.id,
            proveedor.cuenta,
            proveedor.correo,
            hash,
            cuentaBlockchain //Direccion que recibira el NFT
        ).send({from: cuentaBlockchain});

        console.log('NFT ninteado con exito:' , tx.transactionHash);

        Swal.close();
        Swal.fire('Exito', 'NFT ninteado con hash de transaccion: ' + tx.transactionHash, 'success');

    }catch (error){
        console.error('Error al mintear el NFT:', error);
        Swal.close();
        Swal.fire('Error', error.message, 'error');
    }
}

async function verificarNFT(id) {
    try {
        Swal.fire({ title: 'Verificando NFT', didOpen: () => { Swal.showLoading() } });
        const response = await axios.get(` http://localhost:3000/api/proveedores/nft/verify-complete/${id}/${cuentaBlockchain}`);
        const result = response.data;
        Swal.close();

    if (result.hasNFT) {
        Swal.fire({
            icon: result.ownership.isOwner ? 'success' : 'warning',
            title: result.ownership.isOwner ? 'NFT encontrado (Te pertenece)' : 'NFT encontrado (No te pertenece)',
            html: `
                <strong>Token ID:</strong> ${result.tokenId}<br>
                <strong>Factura ID:</strong> ${result.metadata.proveedoresId}<br> 
                <strong>cuenta:</strong> ${result.metadata.cuenta}<br> 
                <strong>correo:</strong> ${result.metadata.correo}<br> 
                <strong>Hash:</strong> ${result.metadata.hash}<br>
                <strong>Fecha:</strong> ${new Date(result.metadata.timestamp * 1000).toLocaleString()}<br><br>

                <strong>Propietario:</strong> ${result.ownership.owner}<br>
                <strong>Tu Cuenta:</strong> ${cuentaBlockchain}<br>
                <strong>Te pertenece:</strong> ${result.ownership.isOwner ? 'Sí' : 'No'}<br>
                `
        } );

    } else {
        Swal.fire('Información', 'No se encontró un NFT para esta factura.', 'info');
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
        const response = await axios.get(` http://localhost:3000/api/proveedores/${id}/pdf`);
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