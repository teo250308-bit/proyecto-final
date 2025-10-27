<?php
require_once "conexion.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["id"], $data["rol"])) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE usuarios SET rol = :rol WHERE id = :id");
    $stmt->bindParam(":rol", $data["rol"]);
    $stmt->bindParam(":id", $data["id"]);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "Rol actualizado correctamente"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
