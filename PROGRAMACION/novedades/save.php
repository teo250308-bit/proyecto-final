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
    if (!is_array($payload)) {
        throw new Exception('Datos inválidos');
    }

    $id = isset($payload['id']) ? (int)$payload['id'] : null;
    $titulo = trim($payload['titulo'] ?? '');
    $descripcion = trim($payload['descripcion'] ?? '');
    $imagen = trim($payload['imagen'] ?? '');
    $orden = isset($payload['orden']) ? (int)$payload['orden'] : 0;
    $activo = !empty($payload['activo']) ? 1 : 0;

    if ($titulo === '') {
        throw new Exception('El título es obligatorio');
    }

    if ($id) {
        $sql = "UPDATE Novedad
                SET titulo = :titulo,
                    descripcion = :descripcion,
                    imagen = :imagen,
                    orden = :orden,
                    activo = :activo
                WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':titulo' => $titulo,
            ':descripcion' => $descripcion ?: null,
            ':imagen' => $imagen ?: null,
            ':orden' => $orden,
            ':activo' => $activo,
            ':id' => $id,
        ]);
    } else {
        $sql = "INSERT INTO Novedad (titulo, descripcion, imagen, orden, activo)
                VALUES (:titulo, :descripcion, :imagen, :orden, :activo)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':titulo' => $titulo,
            ':descripcion' => $descripcion ?: null,
            ':imagen' => $imagen ?: null,
            ':orden' => $orden,
            ':activo' => $activo,
        ]);
        $id = (int)$conn->lastInsertId();
    }

    echo json_encode(['ok' => true, 'id' => $id]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
