<?php
header("Content-Type: application/json; charset=utf-8");
require_once "conexion.php";

$stmt = $conn->query("SELECT id, nombre, email, rol FROM usuarios ORDER BY id DESC");
$usuarios = $stmt->fetchAll();

echo json_encode(["success" => true, "data" => $usuarios]);
?>