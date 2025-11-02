<?php
require_once "../conexion.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["nombre"], $data["correo"], $data["contrasena"], $data["rol"])) {
  echo json_encode(["success" => false, "message" => "Datos incompletos"]);
  exit;
}

try {
  $stmt = $conn->prepare("INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (:n, :c, :p, :r)");
  $stmt->execute([
    ":n" => $data["nombre"],
    ":c" => $data["correo"],
    ":p" => password_hash($data["contrasena"], PASSWORD_DEFAULT),
    ":r" => $data["rol"]
  ]);
  echo json_encode(["success" => true, "message" => "Usuario agregado correctamente"]);
} catch (PDOException $e) {
  if ($e->getCode() == 23000) {
    echo json_encode(["success" => false, "message" => "El correo ya está registrado."]);
  } else {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
  }
}
?>
