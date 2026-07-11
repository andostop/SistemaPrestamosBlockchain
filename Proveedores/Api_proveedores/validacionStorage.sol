// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Define el contrato
contract ProveedoresValidacion {
        //Es como una clase
        struct Proveedores {
            uint id;
            string cuenta;
            string correo;
        }

        //Diccionario es como una lista facturas [1] [2]
        mapping (uint => Proveedores) private proveedores;

        //Funciones
        function createValidacion(uint _id, string memory _cuenta, string memory _correo)public {
            //Es como el if y sirve para evitar duplicado
            require(proveedores[_id].id == 0, "Factura ya existe en blockchain");

            //Guardar como item en la factura
            proveedores[_id] = Proveedores(_id,_cuenta,_correo);
        }
        function getProveedores(uint _id) public view returns (Proveedores memory) {
            require(proveedores[_id].id !=0, "Proveedor no existe");

            return  proveedores [_id];
        }
}