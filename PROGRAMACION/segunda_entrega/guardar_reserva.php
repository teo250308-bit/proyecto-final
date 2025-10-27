<!-- guardar_reserva.php -->
<?php
include("conexion.php");

$nombre   = $_POST['nombre'];
$fecha    = $_POST['fecha'];
$hora     = $_POST['hora'];
$personas = $_POST['personas'];

$sql = "INSERT INTO reservas (nombre, fecha, hora, personas) 
        VALUES ('$nombre','$fecha','$hora',$personas)";
if ($conn->query($sql) === TRUE) {
    echo "Reserva agendada con éxito";
} else {
    echo "Error: " . $conn->error;
}
$conn->close();
?>
