let id = null;
window.addEventListener(
    'DOMContentLoaded',
    () => {
        const urlParams =
            new URLSearchParams(window.location.search);
        id = urlParams.get('id');
        if (id) {
            buscarPorId(id);
        }
    }
);

function guardarPago() {
    const pago = {
        clienteId:
            document.getElementById('cliente').value,
        prestamoId:
            document.getElementById('prestamo').value,
        montoPagado:
            document.getElementById('monto').value,
        saldoRestante:
            document.getElementById('saldo').value,
        fecha:
            document.getElementById('fecha').value,
        metodoPago:
            document.getElementById('metodo').value
    };

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (id) {
        axios.put(
            'http://localhost:3000/pagos/' + id,
            pago,
            axiosConfig
        )
        .then(() => {
            Swal.fire(
                'Correcto',
                'Pago actualizado',
                'success'
            );
            cancelar();
        })

        .catch(error => {
            console.error(error);
            Swal.fire(
                'Error',
                'No se pudo actualizar el pago',
                'error'
            );
        });

    } else {
        axios.post(
            'http://localhost:3000/pagos',
            pago,
            axiosConfig
        )
        .then(() => {
            Swal.fire(
                'Correcto',
                'Pago guardado',
                'success'
            );
            cancelar();
        })

        .catch(error => {
            console.error(error);
            Swal.fire(
                'Error',
                'No se pudo guardar el pago',
                'error'
            );
        });
    }
}

function cancelar() {
    window.location.href = 'pagos.html';
}

function buscarPorId(id) {
    axios.get(
        'http://localhost:3000/pagos/' + id
    )
    .then(response => {
        const pago = response.data;
        document.getElementById('cliente').value =
            pago.cliente_id;
        document.getElementById('prestamo').value =
            pago.prestamo_id;
        document.getElementById('monto').value =
            pago.monto_pagado;
        document.getElementById('saldo').value =
            pago.saldo_restante;
        document.getElementById('fecha').value =
            pago.fecha
            ? pago.fecha.substring(0,10)
            : '';
        document.getElementById('metodo').value =
            pago.metodo_pago;
    })

    .catch(error => {
        console.error(error);
        Swal.fire(
            'Error',
            'No se pudo cargar el pago por ID',
            'error'
        );
    });
}