// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClienteContrato {

    // Estructura que almacena la información de un cliente
    struct Cliente {
        uint id;
        string nombre;
        string dni;
    }

    // Almacena los clientes usando el id como clave
    mapping(uint => Cliente) private clientes;

    // Registra un nuevo cliente
    function createCliente(
        uint _id,
        string memory _nombre,
        string memory _dni
    ) public {

        // Verifica que el cliente no exista previamente
        require(
            clientes[_id].id == 0,
            "Cliente ya existe"
        );

        // Guarda el cliente en la colección
        clientes[_id] = Cliente(
            _id,
            _nombre,
            _dni
        );
    }

    // Obtiene los datos de un cliente según su id
    function getCliente(uint _id)
        public
        view
        returns (Cliente memory)
    {

        // Verifica que el cliente exista
        require(
            clientes[_id].id != 0,
            "Cliente no existe"
        );

        // Retorna la información encontrada
        return clientes[_id];
    }
}