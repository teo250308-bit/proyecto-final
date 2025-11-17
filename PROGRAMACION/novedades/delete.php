<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id']) || !isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Acceso denegado']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

require_once __DIR__ . '/../conexion.php';
require_once __DIR__ . '/news_utils.php';

try {
    ensureNewsTable($conn);
    $payload = json_decode(file_get_contents('php://input'), true);
    $id = isset($payload['id']) ? (int)$payload['id'] : 0;
    if ($id <= 0) {
        throw new Exception('ID inválido');
    }

    $stmt = $conn->prepare('DELETE FROM Novedad WHERE id = :id');
    $stmt->execute([':id' => $id]);

    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
