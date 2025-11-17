<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

try {
    $conn->exec("
        CREATE TABLE IF NOT EXISTS Mensaje_contacto (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(120) NOT NULL,
            email VARCHAR(150) NOT NULL,
            mensaje TEXT NOT NULL,
            creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $nombre = trim($_POST['nombre'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $mensaje = trim($_POST['mensaje'] ?? '');

    if ($nombre === '' || $email === '' || $mensaje === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Completa todos los campos']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO Mensaje_contacto (nombre, email, mensaje) VALUES (:n, :e, :m)");
    $stmt->execute([
        ':n' => $nombre,
        ':e' => $email,
        ':m' => $mensaje,
    ]);

    // Envío simulado (no sale correo real)
    echo json_encode([
        'ok' => true,
        'mail_sent' => false,
        'mail_method' => 'none',
        'mail_error' => 'Envio simulado (sin SMTP configurado)',
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
