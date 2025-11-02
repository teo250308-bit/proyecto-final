<?php
header('Content-Type: application/json');
include '../conexion.php';

try {
    $sql = "SELECT * FROM Producto";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($resultado);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
