CREATE TABLE IF NOT EXISTS pagos (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id      INT NOT NULL,
    prestamo_id     INT NOT NULL,
    monto_pagado    DECIMAL(10,2) NOT NULL,
    saldo_restante  DECIMAL(10,2) NOT NULL,
    fecha           VARCHAR(20) NOT NULL,
    metodo_pago     VARCHAR(50) NOT NULL,
    estado          VARCHAR(20) DEFAULT 'PENDIENTE', -- COMMENT 'Estados: PENDIENTE, ENVIADO, CANCELADO'
    tx_hash_block   VARCHAR(255),
    ipfs_hash       VARCHAR(255)
);