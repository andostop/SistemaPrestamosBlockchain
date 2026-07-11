// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@4.9.6/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.9.6/access/Ownable.sol";

contract ProveedoresNFT is ERC721, Ownable {
uint256 private _tokenIdCounter;

// Custom errors para gas optimization
error NFTYaExiste(uint proveedoresId);
error DireccionInvalida();
error CampoRequerido(string campo);
error TokenNoExiste(uint256 tokenId);

struct ProveedoresMetadata {
    uint proveedoresId;
    string cuenta;
    string correo;
    bytes32 hash;
    uint256 timestamp;
}

mapping(uint256 => ProveedoresMetadata) public proveedoresMetadata;
mapping(uint256 => uint256) public proveedoresToTokenId;

event NFTMinted(uint256 indexed tokenId, uint proveedoresId, address indexed to);

constructor() ERC721("ProveedoresNFT", "FNFT") {
    _tokenIdCounter = 1; // Empezar desde 1 (0 suele reservarse)
}

    function mintProveedoresNFT(
            uint proveedoresId,
            string memory cuenta,
            string memory correo,
            bytes32 hash,
            address to
    ) public returns (uint256) {
            if (proveedoresToTokenId[proveedoresId] != 0) revert NFTYaExiste(proveedoresId);
            if (to == address(0)) revert DireccionInvalida();
            if (bytes(cuenta).length == 0) revert CampoRequerido("cuenta");
            if (bytes(correo).length == 0) revert CampoRequerido("correo");
    
         uint256 tokenId = _tokenIdCounter++;
         _safeMint(to, tokenId);
    
        proveedoresMetadata[tokenId] = ProveedoresMetadata({
                proveedoresId: proveedoresId,
                cuenta: cuenta,
                correo: correo,
                hash: hash,
                timestamp: block.timestamp
    });

        proveedoresToTokenId[proveedoresId] = tokenId;
        emit NFTMinted(tokenId, proveedoresId, to);
    
        return tokenId;
    }

    function getMetadata(uint256 tokenId) public view returns (ProveedoresMetadata memory) {
        if (_ownerOf(tokenId) == address(0)) revert TokenNoExiste(tokenId);
        return proveedoresMetadata[tokenId];
    }

    function getTokenId(uint proveedoresId) public view returns (uint256) {
        return proveedoresToTokenId[proveedoresId];
    }
}