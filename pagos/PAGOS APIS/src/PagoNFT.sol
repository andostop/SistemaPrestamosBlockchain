// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts@4.9.6/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.9.6/access/Ownable.sol";

contract PagoNFT is ERC721, Ownable {

    uint256 private _tokenIdCounter;

    // Custom errors para ahorrar gas
    error NFTYaExiste(uint pagoId);
    error DireccionInvalida();
    error TokenNoExiste(uint256 tokenId);

    struct PagoMetadata {
        uint pagoId;
        uint clienteId;
        uint montoPagado;
        bytes32 hash;
        uint256 timestamp;
    }

    // Metadata del NFT
    mapping(uint256 => PagoMetadata) public pagoMetadata;

    // Relación Pago -> Token
    mapping(uint256 => uint256) public pagoToTokenId;

    // Evento
    event NFTMinted(
        uint256 indexed tokenId,
        uint pagoId,
        address indexed to
    );

    constructor() ERC721("PagoNFT", "PNFT") {
        _tokenIdCounter = 1;
    }

    function mintPagoNFT(
        uint pagoId,
        uint clienteId,
        uint montoPagado,
        bytes32 hash,
        address to
    ) public returns (uint256) {

        if (pagoToTokenId[pagoId] != 0)
            revert NFTYaExiste(pagoId);

        if (to == address(0))
            revert DireccionInvalida();

        uint256 tokenId = _tokenIdCounter++;

        _safeMint(to, tokenId);

        pagoMetadata[tokenId] = PagoMetadata({
            pagoId: pagoId,
            clienteId: clienteId,
            montoPagado: montoPagado,
            hash: hash,
            timestamp: block.timestamp
        });

        pagoToTokenId[pagoId] = tokenId;

        emit NFTMinted(tokenId, pagoId, to);

        return tokenId;
    }

    function getMetadata(uint256 tokenId)
        public
        view
        returns (PagoMetadata memory)
    {
        if (_ownerOf(tokenId) == address(0))
            revert TokenNoExiste(tokenId);

        return pagoMetadata[tokenId];
    }

    function getTokenId(uint pagoId)
        public
        view
        returns (uint256)
    {
        return pagoToTokenId[pagoId];
    }
}