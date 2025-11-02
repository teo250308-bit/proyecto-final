<?php
require_once "../conexion.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["nombre"], $data["descripcion"], $data["imagen"], $data["precio"], $data["tipo"])) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO Producto (Nombre, Descripcion, Imagen, Precio, Tipo) VALUES (:n, :d, :i, :p, :t)");
    $stmt->execute([
        ":n" => $data["nombre"],
        ":d" => $data["descripcion"],
        ":i" => $data["imagen"],
        ":p" => $data["precio"],
        ":t" => $data["tipo"]
    ]);
    echo json_encode(["success" => true, "message" => "Plato agregado correctamente"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
