<?php
if (!function_exists('ensureAnalyticsSchema')) {
    /**
     * Ensures analytics-related tables and columns exist before querying.
     */
    function ensureAnalyticsSchema(PDO $conn): void
    {
        ensureColumnExists($conn, 'Reserva', 'Origen', "VARCHAR(30) NOT NULL DEFAULT 'Web'");
        ensureColumnExists($conn, 'Pedido', 'Origen', "VARCHAR(30) NOT NULL DEFAULT 'Web'");

        $conn->exec("
            CREATE TABLE IF NOT EXISTS Visita (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                pagina VARCHAR(255) NULL,
                referrer VARCHAR(255) NULL,
                ip VARCHAR(64) NULL,
                user_agent VARCHAR(255) NULL,
                id_usuario INT NULL,
                INDEX idx_fecha (fecha),
                INDEX idx_pagina (pagina),
                INDEX idx_usuario (id_usuario)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

    }
}

if (!function_exists('ensureColumnExists')) {
    function ensureColumnExists(PDO $conn, string $table, string $column, string $definition): void
    {
        $sql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table AND COLUMN_NAME = :column";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':table' => $table,
            ':column' => $column,
        ]);
        if ((int)$stmt->fetchColumn() === 0) {
            $conn->exec("ALTER TABLE {$table} ADD {$column} {$definition}");
        }
    }
}

if (!function_exists('getClientIp')) {
    function getClientIp(): string
    {
        foreach ([
            'HTTP_CLIENT_IP',
            'HTTP_X_FORWARDED_FOR',
            'REMOTE_ADDR',
        ] as $key) {
            if (!empty($_SERVER[$key])) {
                $raw = explode(',', $_SERVER[$key])[0];
                return trim($raw);
            }
        }
        return '0.0.0.0';
    }
}
