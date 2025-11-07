<?php
require '../conexion.php';

// Sesión persistente (30 días)
session_set_cookie_params([
  'lifetime' => 60 * 60 * 24 * 30,
  'path' => '/',
  'secure' => false, // Cambiar a true con HTTPS
  'httponly' => true,
  'samesite' => 'Lax'
]);
session_start();

// Recibir datos JSON
$input = json_decode(file_get_contents("php://input"), true);
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

try {
  $stmt = $conn->prepare("SELECT id, contrasena FROM usuarios WHERE correo = ?");
  $stmt->execute([$email]);
  $row = $stmt->fetch();

  if ($row && password_verify($password, $row['contrasena'])) {
    $_SESSION['user_id'] = $row['id'];
    session_regenerate_id(true);
    echo json_encode(["ok" => true, "msg" => "Login exitoso"]);
  } else {
    echo json_encode(["ok" => false, "msg" => "Credenciales inválidas"]);
  }
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(["ok" => false, "msg" => "Error: " . $e->getMessage()]);
}
?>

