<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

$auth = isset($_SESSION['user_id']);

if (!$auth) {
  http_response_code(200);
  echo json_encode(["auth" => false]);
  exit;
}

$payload = [
  "auth" => true,
  "user_id" => $_SESSION['user_id']
];

if (isset($_SESSION['rol']) && $_SESSION['rol']) {
  $payload['rol'] = $_SESSION['rol'];
}

// Intenta enviar también el nombre si existe en la sesión
if (isset($_SESSION['nombre']) && $_SESSION['nombre']) {
  $payload['nombre'] = $_SESSION['nombre'];
} elseif (isset($_SESSION['usuario']) && $_SESSION['usuario']) {
  $payload['usuario'] = $_SESSION['usuario'];
} elseif (isset($_SESSION['email']) && $_SESSION['email']) {
  $payload['email'] = $_SESSION['email'];
}

echo json_encode($payload, JSON_UNESCAPED_UNICODE);
?>
