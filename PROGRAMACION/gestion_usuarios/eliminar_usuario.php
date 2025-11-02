<?php
require_once "../conexion.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["id"])) {
  echo json_encode(["success" => false, "message" => "ID no proporcionado"]);
  exit;
}

try {
  $stmt = $conn->prepare("DELETE FROM usuarios WHERE id = :id AND rol != 'admin'");
  $stmt->execute([":id" => $data["id"]]);

  if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => true, "message" => "Usuario eliminado correctamente"]);
  } else {
    echo json_encode(["success" => false, "message" => "No se puede eliminar un administrador."]);
  }
} catch (PDOException $e) {
  echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
