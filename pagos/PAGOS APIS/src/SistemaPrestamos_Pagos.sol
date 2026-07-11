// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PagoContrato {

    struct Pago {
        uint id;
        uint clienteId;
        uint montoPagado;
        uint timestamp;
    }

    mapping(uint => Pago) private pagos;

    uint[] private historialPagos;


    function createPago(
        uint _id,
        uint _clienteId,
        uint _montoPagado,
        uint _timestamp
    ) public {

        require(
            pagos[_id].id == 0,
            "Pago ya existe"
        );

        pagos[_id] = Pago(
            _id,
            _clienteId,
            _montoPagado,
            _timestamp
        );

        historialPagos.push(_id);
    }


    function getPago(uint _id)
        public
        view
        returns(Pago memory)
    {
        require(
            pagos[_id].id != 0,
            "Pago no existe"
        );

        return pagos[_id];
    }


    function getHistorialPagos()
        public
        view
        returns(uint[] memory)
    {
        return historialPagos;
    }
}