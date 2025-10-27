<?php
header("Content-Type: application/json; charset=utf-8");
require_once "conexion.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit;
}

// Leer JSON (compatible con fetch JSON)
$input = json_decode(file_get_contents('php://input'), true);
$nombre = trim($input['nombre'] ?? '');
$email  = trim($input['email'] ?? '');
$pass   = $input['password'] ?? '';
$rol    = $input['rol'] ?? 'usuario';

// validaciones básicas
if (!$nombre || !$email || !$pass) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Faltan campos obligatorios"]);
    exit;
}

// valida email simple
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email inválido"]);
    exit;
}

// hash de la contraseña
$hash = password_hash($pass, PASSWORD_DEFAULT);

try {
    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)");
    $stmt->execute([$nombre, $email, $hash, $rol]);
    echo json_encode(["success" => true, "message" => "Usuario agregado"]);
} catch (PDOException $e) {
    // si el email tiene unique constraint puede fallar
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al agregar usuario"]);
}
?>
