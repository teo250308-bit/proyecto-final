<?php
require '../conexion.php';
header('Content-Type: application/json; charset=utf-8');
session_start();

if (!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode([ 'ok' => false, 'msg' => 'No autenticado' ], JSON_UNESCAPED_UNICODE);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$nombre = trim($input['nombre'] ?? '');
$email  = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if ($nombre === '' || $email === '') {
  http_response_code(400);
  echo json_encode([ 'ok' => false, 'msg' => 'Nombre y email son obligatorios' ], JSON_UNESCAPED_UNICODE);
  exit;
}

try {
  $sets = [ 'nombre = :nombre', 'correo = :correo' ];
  $params = [ ':nombre' => $nombre, ':correo' => $email, ':id' => $_SESSION['user_id'] ];
  if (!empty($password)) {
    $sets[] = 'contrasena = :contrasena';
    $params[':contrasena'] = password_hash($password, PASSWORD_BCRYPT);
  }
  $sql = 'UPDATE usuarios SET ' . implode(', ', $sets) . ' WHERE id = :id';
  $stmt = $conn->prepare($sql);
  $stmt->execute($params);

  // Refrescar datos de sesión
  $_SESSION['nombre'] = $nombre;
  $_SESSION['email'] = $email;

  echo json_encode([ 'ok' => true, 'msg' => 'Perfil actualizado' ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode([ 'ok' => false, 'msg' => 'Error: ' . $e->getMessage() ], JSON_UNESCAPED_UNICODE);
}
?>
