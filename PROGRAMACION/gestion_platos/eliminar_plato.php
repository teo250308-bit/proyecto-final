<?php
require_once "../conexion.php";
require_once __DIR__ . "/imagen_utils.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$id = $data["id"] ?? null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "ID no proporcionado"]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT Imagen FROM Producto WHERE Id_producto = :id");
    $stmt->execute([":id" => $id]);
    $plato = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$plato) {
        echo json_encode(["success" => false, "message" => "Plato no encontrado"]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM Producto WHERE Id_producto = :id");
    $stmt->execute([":id" => $id]);

    deleteLocalImage($plato["Imagen"]);

    echo json_encode(["success" => true, "message" => "Plato eliminado correctamente"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
