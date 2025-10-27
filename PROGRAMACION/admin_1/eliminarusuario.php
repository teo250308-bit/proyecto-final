<?php
session_start();
include 'conexion.php';
$id=$_GET['id'];

$stmt = $conn->prepare("DELETE FROM usuarios WHERE id=?");
$stmt->execute([$id]);

$resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode ($resultado);
?>
