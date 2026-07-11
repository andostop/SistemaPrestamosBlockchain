// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts@4.9.6/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.9.6/access/Ownable.sol";

contract ClienteNFT is ERC721, Ownable {

    uint256 private _tokenIdCounter;

    // Custom errors para gas optimization
    error NFTYaExiste(uint clienteId);
    error DireccionInvalida();
    error CampoRequerido(string campo);
    error TokenNoExiste(uint256 tokenId);

    //Estructura de datos para almacenar la metadata del cliente
    struct ClienteMetadata {
        uint clienteId;
        string nombre;
        string dni;
        bytes32 hash;
        uint256 timestamp; //Fecha de creacion del NFT
    }

    //Diccionarios
    mapping(uint256 => ClienteMetadata) public clienteMetadata; //Metadata del cliente
    mapping(uint256 => uint256) public clienteToTokenId; // Relacion entre cliente y token para evitar duplicados

    //Eventos cuando se crean un NFTs
    event NFTMinted(uint256 indexed tokenId, uint clienteId, address indexed to);

    constructor() ERC721("ClienteNFT", "CNFT") {
        _tokenIdCounter = 1; // Empezar desde 1 (0 suele reservarse)
    }

    //Funcion para crear un NFT a partir de un Cliente
    function mintClienteNFT(
        uint clienteId,
        string memory nombre,
        string memory dni,
        bytes32 hash, // Hash del cliente en el backend
        address to // Direccion del propietario del NFT
    ) public returns (uint256) {

        //Validar que el cliente no tenga un NFT previamente
        if (clienteToTokenId[clienteId] != 0)
            revert NFTYaExiste(clienteId);

        //Validar que la direccion sea valida
        if (to == address(0))
            revert DireccionInvalida();

        //Validar que el nombre no este vacio
        if (bytes(nombre).length == 0)
            revert CampoRequerido("nombre");

        //Validar que el DNI no este vacio
        if (bytes(dni).length == 0)
            revert CampoRequerido("dni");

        uint256 tokenId = _tokenIdCounter++; // Obtiene el ID del token

        _safeMint(to, tokenId); // Asignar el propietario del NFT

        clienteMetadata[tokenId] = ClienteMetadata({
            clienteId: clienteId,
            nombre: nombre,
            dni: dni,
            hash: hash,
            timestamp: block.timestamp
        });

        //ASIGNAR EL TOKEN ID AL CLIENTE
        clienteToTokenId[clienteId] = tokenId;

        emit NFTMinted(tokenId, clienteId, to); //Emitir evento de creacion del NFT

        return tokenId;
    }

    // Obtener metadata del NFT
    function getMetadata(uint256 tokenId) public view returns (ClienteMetadata memory) {
        //Validar que el token exista
        if (_ownerOf(tokenId) == address(0)) revert TokenNoExiste(tokenId);
        return clienteMetadata[tokenId];
    }

    // Obtener TokenId por clienteID
    function getTokenId(uint clienteId) public view returns (uint256) {
        return clienteToTokenId[clienteId];
    }
}