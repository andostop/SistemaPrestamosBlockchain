// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ValidacionNFT{
    string  public  name = "ValidacionNFT";
    string  public  symbol = "FNFT";
    uint256 private _tokenIdCounter = 0;
    address public  owner;

    struct ValidacionMetadata {
        uint validacionId;
        string cuenta;
        string correo;
        bytes32 hash;
        uint256 timestamp;
    }

    //Diccionarios
    mapping(uint256 => ValidacionMetadata) public validacionMetadata; //Metadata de la factura -guardar
    mapping(uint => uint256              ) public validacionToTokenId; //Relacion entre factura y token para evitar duplicados - validacion
    mapping(uint256 => address           ) public tokenOwner;//Propietario del token
    mapping (address => uint256)           public balanceOf;//Balance de tokens del propietario - cuantos tokens tiene

    //Eventos al crear o transferir NFTS

    event NFTMinted(uint256 indexed tokenId, uint validacionId, address indexed to); //Evento que se emiten cuando se crea un NFT
    event Transfer(address indexed from, address indexed to, uint indexed  tokenId); //Evento cuando se transfiere un NFT

    modifier onlyOwner() {
        require(msg.sender == owner, "solo el propietaro puede llamar a esta funcion "); _;
    }

    constructor() {
        owner = msg.sender; //Propietario del contrato (Quien lo despliega 0x....)
    }

    //Funcion para crear una NFT  a partir de los proveedores - validacion
    function mintValidacionNFT (
        uint validacionId,
        string memory cuenta,
        string memory correo,
        bytes32 hash, // Hash de la validacion en el backend
        address to // Direccion del propietario del NFT
    )public onlyOwner returns (uint256){
        //TODO: Agregar validacion
        require(validacionToTokenId[validacionId] == 0, "NFT ya existe para este proveedor");

        uint256 tokenId = _tokenIdCounter;//Obtiene el ID del token
        _tokenIdCounter++;

        tokenOwner[tokenId] = to; //Asignar el propietario del token
        balanceOf[to]++; //Incrementar el balance del propietario

        validacionMetadata[tokenId] = ValidacionMetadata({
            validacionId: validacionId,
            cuenta: cuenta,
            correo: correo,
            hash: hash,
            timestamp: block.timestamp
        });

        //TODO: ASIGNAR EL TOKEN ID AL PROVEEDOR Y EMITIR EVENTOS
        validacionToTokenId[validacionId] = tokenId;

        //Emitir evento de creacion NFT
        emit NFTMinted(tokenId, validacionId, to);//Emitir evento de creacion NFT
        emit Transfer(address(0), to, tokenId);//Emitir evento de transferencia del NFT

        return tokenId;
    }

}