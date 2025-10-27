<?php
include 'conexion.php';

$sql = "SELECT * FROM Producto";
$stmt = $conn->prepare($sql);
$stmt->execute();

$resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($resultado) {
        echo json_encode ($resultado);
} else {
    echo json_encode (["data" => "No hay datos"]);
}

?>