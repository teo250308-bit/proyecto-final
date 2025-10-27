<?php
header("Content-Type: application/json; charset=utf-8");
require_once "conexion.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$id = intval($input['id'] ?? 0);
$rol = $input['rol'] ?? '';

$allowed = ['usuario','administrador','empleado'];
if ($id <= 0 || !in_array($rol, $allowed)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Datos inválidos"]);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE usuarios SET rol = ? WHERE id = ?");
    $stmt->execute([$rol, $id]);
    echo json_encode(["success" => true, "message" => "Rol actualizado"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al actualizar rol"]);
}
?>