-- Crear tabla clientes

CREATE TABLE IF NOT EXISTS clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    correo VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'PENDIENTE', -- 'Estados: PENDIENTE, ENVIADA, CONFIRMADA'
    tx_hash_block VARCHAR(255), -- Hash de el cliente en blockchain
    ipfs_hash     VARCHAR(255)  -- Hash del archivo en IPFS
);