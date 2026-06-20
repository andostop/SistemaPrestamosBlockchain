let id = null;
window.addEventListener('DOMContentLoaded', // Evento al cargar la página
    () => {
        const urlParams = new URLSearchParams(window.location.search);
        id = urlParams.get('id');
        if (id) {
            buscarPorId(id);
        }
    }
);

function guardarPrestamo() {
    const prestamo = {
        cliente_id: document.getElementById('cliente_id').value,
        monto: document.getElementById('monto').value,
        plazo: document.getElementById('plazo').value,
        interes: document.getElementById('interes').value,
        estado: document.getElementById('estado').value
    }
    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (id) {
        // actualizar prestamo
        axios.put('http://localhost:3000/prestamos/' + id, prestamo, axiosConfig)
            .then(response => {
                cancelar();
            })
            .catch(error => {
                Swal.fire('Error', 'No se pudo actualizar el prestamo', error);
            });
    } else {
        // Crear nuevo prestamo
        axios.post('http://localhost:3000/prestamos', prestamo, axiosConfig)
            .then(response => {
                cancelar();
            })
            .catch(error => {
                Swal.fire('Error', 'No se pudo guardar el prestamo', error);
            });
    }
}

function cancelar() {
    window.location.href = 'prestamo.html';
}

function buscarPorId(id) {
    axios.get('http://localhost:3000/prestamos/' + id)
        .then(response => {
            const prestamo = response.data;
            document.getElementById('cliente_id').value = prestamo.cliente_id;
            document.getElementById('monto').value = prestamo.monto;
            document.getElementById('plazo').value = prestamo.plazo;
            document.getElementById('interes').value = prestamo.interes;
            document.getElementById('estado').value = prestamo.estado;
        })
        .catch(error => {
            Swal.fire('Error', 'No se pudo cargar el prestamo por ID: ' + id, error);
        });
}