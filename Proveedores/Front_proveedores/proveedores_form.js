
let id = null;
window.addEventListener('DOMContentLoaded', //Evento al cargar la pagina
    () => {
        const urlParams = new URLSearchParams(window.location.search);
        id = urlParams.get('id');
        if (id) {
            buscarPorId(id);
        }
    }
);


function guardarProveedores() {
    const proveedores = {
        codigo: document.getElementById('codigo').value,
        ruc: document.getElementById('ruc').value,
        contacto: document.getElementById('contacto').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value,
        banco: document.getElementById('banco').value,
        cuenta: document.getElementById('cuenta').value,
    }
    const axiosConfig = {
        headers: {
            'content-type': 'application/json'
        }
    };

    if (id){
        //Actualizar proveedor
        axios.put ('http://localhost:3000/api/proveedores/' + id, proveedores, axiosConfig)
        .then(response =>{
            cancelarProveedores();
        })
        .catch(error => {
            Swal.fire('Error', 'No se puedo actualizar al proveedor', error);
        });
    }else{
        //Crear nueva  factura
        axios.post('http://localhost:3000/api/proveedores', proveedores, axiosConfig)
        .then(response => {
            cancelarProveedores();
        })
        .catch(error => {
            Swal.fire('Error','No se pudo guardar al proveedor', error);
        });
    }
}

function cancelarProveedores(){
    window.location.href = 'proveedores.html';
}

function buscarPorId(id) {
    axios.get('http://localhost:3000/api/proveedores/' + id)
        .then(response => {
            const proveedores = response.data;
            document.getElementById('codigo').value = proveedores.codigo;
            document.getElementById('ruc').value = proveedores.ruc;
            document.getElementById('contacto').value = proveedores.contacto;
            document.getElementById('telefono').value = proveedores.telefono;
            document.getElementById('correo').value = proveedores.correo;
            document.getElementById('banco').value = proveedores.banco;
            document.getElementById('cuenta').value = proveedores.cuenta;
        })
        .catch(error => {
            Swal.fire('Error', 'No se pudo cargar la factura por ID:' + id, error);
        });
}