<?php
header('Content-Type: application/json');

require '../conexion.php';

$nombre   = $_POST['nombre'] ?? '';
$email    = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($nombre) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "msg" => "Todos los campos son obligatorios"]);
    exit;
}

$hashed = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)");
    $ok = $stmt->execute([$nombre, $email, $hashed]);

    if ($ok) {
        echo json_encode(["success" => true, "msg" => "Usuario registrado correctamente"]);
    } else {
        echo json_encode(["success" => false, "msg" => "Error al registrar usuario"]);
    }
} catch (Throwable $e) {
    echo json_encode(["success" => false, "msg" => "Error: " . $e->getMessage()]);
}
?>

