
<?php
session_start();
include 'conexion.php';

$stmt = $conn->prepare("SELECT * FROM usuarios");
$stmt->execute();

$resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode ($resultado);

?>
