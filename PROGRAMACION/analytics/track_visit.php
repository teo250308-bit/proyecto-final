<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

require_once __DIR__ . '/../conexion.php';
require_once __DIR__ . '/helpers.php';

try {
    ensureAnalyticsSchema($conn);

    $payload = json_decode(file_get_contents('php://input'), true);
    if (!is_array($payload)) {
        $payload = [];
    }

    $pagina = substr($payload['page'] ?? '', 0, 255);
    $titulo = substr($payload['title'] ?? '', 0, 255);
    $referrer = substr($payload['referrer'] ?? '', 0, 255);
    $idUsuario = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;
    $ip = substr(getClientIp(), 0, 64);
    $userAgent = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255);

    $stmt = $conn->prepare("
        INSERT INTO Visita (fecha, pagina, referrer, ip, user_agent, id_usuario)
        VALUES (NOW(), :pagina, :referrer, :ip, :user_agent, :id_usuario)
    ");
    $stmt->execute([
        ':pagina' => $pagina ?: null,
        ':referrer' => $referrer ?: null,
        ':ip' => $ip ?: null,
        ':user_agent' => $userAgent ?: null,
        ':id_usuario' => $idUsuario ?: null,
    ]);

    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
