<!-- actualizar_inventario.php -->
<?php
include("conexion.php");

$id       = $_POST['id'];
$cantidad = $_POST['cantidad'];

$sql = "UPDATE inventario SET cantidad=$cantidad WHERE id=$id";
if ($conn->query($sql) === TRUE) {
    echo "Inventario actualizado";
} else {
    echo "Error: " . $conn->error;
}
$conn->close();
?>
