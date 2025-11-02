<?php
require_once "../conexion.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"], $data["nombre"], $data["descripcion"], $data["imagen"], $data["precio"], $data["tipo"])) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

try {
    $stmt = $conn->prepare("
        UPDATE Producto
        SET Nombre = :n, Descripcion = :d, Imagen = :i, Precio = :p, Tipo = :t
        WHERE Id_producto = :id
    ");

    $stmt->execute([
        ":n"  => $data["nombre"],
        ":d"  => $data["descripcion"],
        ":i"  => $data["imagen"],
        ":p"  => $data["precio"],
        ":t"  => $data["tipo"],
        ":id" => $data["id"]
    ]);

    echo json_encode(["success" => true, "message" => "Plato actualizado correctamente"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
