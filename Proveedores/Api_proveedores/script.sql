-- CREAR BASE DE DATOS

CREATE TABLE IF NOT EXISTS proveedores (
    id         INT PRIMARY KEY AUTO_INCREMENT PRIMARY KEY,
    codigo     VARCHAR(50) NOT NULL UNIQUE,
    ruc        VARCHAR(11) NOT NULL,
    contacto   VARCHAR(255) NOT NULL,
    telefono   VARCHAR(20) NOT NULL,
    correo     VARCHAR(100) NOT NULL,
    banco      VARCHAR(255) NOT NULL,
    cuenta     VARCHAR(30) NOT NULL,
    fecha      TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    estado      VARCHAR(20) DEFAULT 'Activo', -- 'Estados: Activo - Enviada - confirmada'
    tx_hash_block VARCHAR(255), -- HASH de la transacción en la BlockChain
    ipfs_hash     VARCHAR(255) -- Hash del archivo PDF en IPFS
);
