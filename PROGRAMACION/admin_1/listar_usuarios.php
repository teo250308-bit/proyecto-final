<?php
require_once "conexion.php";
header("Content-Type: application/json");

try {
    $stmt = $conn->query("SELECT id, nombre, correo, rol, fecha_registro FROM usuarios ORDER BY id DESC");
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "usuarios" => $usuarios]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
