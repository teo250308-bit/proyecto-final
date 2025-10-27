<!-- guardar_articulo.php -->
<?php
include("conexion.php");

$articulo = $_POST['articulo'];
$cantidad = $_POST['cantidad'];
$precio   = $_POST['precio'];

$sql = "INSERT INTO inventario (articulo, cantidad, precio) 
        VALUES ('$articulo',$cantidad,$precio)";
if ($conn->query($sql) === TRUE) {
    echo "Artículo agregado al inventario";
} else {
    echo "Error: " . $conn->error;
}
$conn->close();
?>
