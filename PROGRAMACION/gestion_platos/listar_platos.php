<?php
require_once "../conexion.php";
header("Content-Type: application/json");

try {
    $stmt = $conn->query("SELECT * FROM Producto ORDER BY Id_producto DESC");
    $platos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "platos" => $platos]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
