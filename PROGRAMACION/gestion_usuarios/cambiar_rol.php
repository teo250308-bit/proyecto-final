<?php
require_once "../conexion.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["id"], $data["rol"])) {
  echo json_encode(["success" => false, "message" => "Datos incompletos"]);
  exit;
}

if (!in_array($data["rol"], ["empleado", "cliente"])) {
  echo json_encode(["success" => false, "message" => "Rol no permitido"]);
  exit;
}

try {
  $stmt = $conn->prepare("UPDATE usuarios SET rol = :rol WHERE id = :id AND rol != 'admin'");
  $stmt->execute([":rol" => $data["rol"], ":id" => $data["id"]]);

  echo json_encode(["success" => true, "message" => "Rol actualizado correctamente"]);
} catch (PDOException $e) {
  echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
