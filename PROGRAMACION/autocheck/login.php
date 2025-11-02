<?php
require 'conexion.php';

// Sesión persistente (30 días)
session_set_cookie_params([
  'lifetime' => 60 * 60 * 24 * 30,
  'path' => '/',
  'secure' => false, // Cambiar a true en producción (HTTPS)
  'httponly' => true,
  'samesite' => 'Lax'
]);
session_start();

// Recibir datos JSON
$input = json_decode(file_get_contents("php://input"), true);
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

$stmt = $conexion->prepare("SELECT id, contrasena FROM usuarios WHERE correo = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
  if (password_verify($password, $row['contrasena'])) {
    $_SESSION['user_id'] = $row['id'];
    session_regenerate_id(true);
    echo json_encode(["ok" => true, "msg" => "Login exitoso"]);
  } else {
    echo json_encode(["ok" => false, "msg" => "Contraseña incorrecta"]);
  }
} else {
  echo json_encode(["ok" => false, "msg" => "Usuario no encontrado"]);
}

$stmt->close();
$conexion->close();
?>