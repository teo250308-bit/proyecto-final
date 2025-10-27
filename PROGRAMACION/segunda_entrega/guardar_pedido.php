<!-- guardar_pedido.php -->
<?php
include("conexion.php");

$cliente  = $_POST['cliente'];
$producto = $_POST['producto'];
$cantidad = $_POST['cantidad'];

$sql = "INSERT INTO pedidos (cliente, producto, cantidad) VALUES ('$cliente','$producto',$cantidad)";
if ($conn->query($sql) === TRUE) {
    echo "Pedido registrado correctamente";
} else {
    echo "Error: " . $conn->error;
}
$conn->close();
?>
