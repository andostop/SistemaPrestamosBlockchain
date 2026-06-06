class Prestamo {

    constructor(
        id,
        clienteId,
        monto,
        plazo,
        interes,
        estado
    ) {

        this.id = id;
        this.clienteId = clienteId;
        this.monto = monto;
        this.plazo = plazo;
        this.interes = interes;
        this.estado = estado;

    }

}

export default Prestamo;