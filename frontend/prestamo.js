window.addEventListener('load', async () => {
    buscarPrestamo();
});

async function buscarPrestamo() {
    try {

        Swal.fire({
            title: 'Cargando préstamos',
            didOpen: () => Swal.showLoading()
        });

        const response =
        await axios.get('http://localhost:3000/prestamos');

        const prestamos = response.data;

        const tbody =
        document.getElementById('prestamosBody');

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
                    <button class="btn btn-sm btn-outline-info">
                        EDITAR
                    </button>
                </td>
            `;

            tbody.appendChild(row);
        });

        Swal.close();

    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los préstamos', 'error');
    }
}

function agregarPrestamo() {
    window.location.href = "prestamos-form.html";
}